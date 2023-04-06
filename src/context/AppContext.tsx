import { createContext, useEffect, useState } from "react";
import {
  calculateOverlap,
  hasValidHeaders,
  isFileEmpty,
  isValidCSV,
  parseDate,
} from "../utils/helpers";
import { AppState, DataRow, ProjectData, ProjectPair } from "./types";

export type ContextType = {
  state: AppState;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  data: any[];
};

export const AppContext = createContext<ContextType>({
  state: {
    state: "",
    error: "",
  },
  setFile: () => {},
  data: [],
});

type AppContextProviderProps = {
  children: JSX.Element;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [state, setState] = useState<AppState>({
    state: "",
    error: "",
  });
  const [file, setFile] = useState<File>();
  const [fileData, setFileData] = useState<string | null>(null);
  const [mappedData, setMappedData] = useState<DataRow[] | null>(null);
  const [finalData, setFinalData] = useState();

  useEffect(() => {
    validateFile();
  }, [file]);

  useEffect(() => {
    parseData();
  }, [fileData]);

  useEffect(() => {
    finalizeData();
  }, [mappedData]);

  const setLoading = (msg: string) => {
    setState({
      state: msg,
      error: "",
    });
  };

  const setError = (e: string) => {
    setState({
      state: "",
      error: e,
    });
  };

  const validateFile = () => {
    if (!file) return;
    setLoading("Parsing");

    if (!isValidCSV(file)) {
      setError("Invalid file format");
      return;
    }

    if (isFileEmpty(file)) {
      setError("Empty file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result;
      setFileData(text ? String(text) : null);
    };
    reader.readAsText(file);
    setLoading("Parsed");
  };

  const parseData = () => {
    if (!fileData) return;
    setLoading("Mapping");

    const header = fileData.slice(0, fileData.indexOf("\n"));
    if (
      !hasValidHeaders(header, ["EmpID", "ProjectID", "DateFrom", "DateTo"])
    ) {
      setError("Missing required headers");
      return;
    }

    const rows = fileData.slice(fileData.indexOf("\n") + 1).split("\n");
    if (rows.length === 0) {
      setError("Missing data");
      return;
    }
    try {
      const data: DataRow[] = rows.map((row) => {
        const values = row.split(",");
        if (values.length < 4) throw new Error("Corrupted data");

        const result = {
          empID: values[0],
          projectID: values[1],
          fromDate: parseDate(values[2]),
          toDate: parseDate(values[3]),
        };
        return result;
      });
      console.log("mapped", data);
      setMappedData(data);
      setLoading("Mapped");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const finalizeData = () => {
    if (!mappedData) return;
    setLoading("Finalizing");

    // group projects
    let projectIds = new Set<string>();
    mappedData.map((item) => projectIds.add(item.projectID));

    let projects: ProjectData[] = [];

    projectIds.forEach((id) => {
      // get all employees that worked on given project
      const employees = mappedData.filter((data) => data.projectID === id);
      // if only 1 employee worked on the project
      if (employees.length === 1) return;

      let projectPairs: ProjectPair[] = [];
      employees.forEach((emp, index) => {
        // if last item return - no pair left
        if (index + 1 === employees.length) return;
        // get all other employees
        const remaining = employees.slice(index + 1);
        remaining.forEach((next) => {
          projectPairs.push({
            employees: {
              aID: emp.empID,
              bID: next.empID,
            },
            time: calculateOverlap(emp, next),
          });
        });
      });

      projects.push({
        id,
        data: [...projectPairs].sort((a, b) => b.time - a.time),
      });
    });

    console.log("projects", projects);

    setLoading("Finalized");
  };

  const context = {
    state,
    setFile,
    data: [],
  };
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
