import { createContext, useEffect, useState } from "react";
import {
  calculateOverlap,
  hasValidHeaders,
  isFileEmpty,
  isValidCSV,
  parseDate,
} from "../utils/helpers";
import {
  AppState,
  DataRow,
  EmployeePair,
  ProjectData,
  ProjectPair,
} from "./types";

export type ContextType = {
  state: AppState;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  pair: EmployeePair | null;
};

export const AppContext = createContext<ContextType>({
  state: {
    state: "",
    error: "",
  },
  setFile: () => {},
  pair: null,
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
  const [projects, setProjects] = useState<ProjectData[] | null>(null);
  const [pairs, setPairs] = useState<EmployeePair[] | null>(null);

  useEffect(() => {
    if (file) validateFile();
  }, [file]);

  useEffect(() => {
    if (fileData) parseData();
  }, [fileData]);

  useEffect(() => {
    if (mappedData) finalizeData();
  }, [mappedData]);

  useEffect(() => {
    if (projects) getPairs();
  }, [projects]);

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
    setLoading("Finalizing");

    let projectIds = new Set<string>();
    mappedData!.map((item) => projectIds.add(item.projectID));

    let _projects: ProjectData[] = [];

    projectIds.forEach((id) => {
      // get all employees that worked on given project
      const employees = mappedData!.filter((data) => data.projectID === id);
      // if only 1 employee worked on the project
      if (employees.length === 1) return;

      let pairs: ProjectPair[] = [];
      employees.forEach((emp, index) => {
        // if last item return - no pair left
        if (index + 1 === employees.length) return;

        // get all other employees
        const remaining = employees.slice(index + 1);
        remaining.forEach((next) => {
          const overlap = calculateOverlap(emp, next);
          if (!overlap) return;

          const pairId = [emp.empID, next.empID].sort().join("");
          pairs.push({
            id: pairId,
            aID: emp.empID,
            bID: next.empID,
            time: overlap,
          });
        });
      });

      _projects.push({
        id,
        pairs,
      });
    });

    console.log("projects", _projects);
    setProjects(_projects);

    setLoading("Finalized");
  };

  const getPairs = () => {
    setLoading("Calculating");

    const pairs: EmployeePair[] = [];

    projects!.forEach((project) => {
      project.pairs.forEach((pair) => {
        const item = pairs.find((p) => p.id === pair.id);
        if (!item)
          pairs.push({
            ...pair,
            projects: [{ id: project.id, time: pair.time }],
          });
        else {
          item.time += pair.time;
          const sorted = [
            ...item.projects,
            { id: project.id, time: pair.time },
          ].sort((a, b) => b.time - a.time);
          item.projects = sorted;
        }
      });
    });

    pairs.sort((a, b) => b.time - a.time);
    console.log("pairs", pairs);
    setPairs(pairs);

    setLoading("Done");
  };

  const context = {
    state,
    setFile,
    pair: pairs ? pairs[0] : null,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
