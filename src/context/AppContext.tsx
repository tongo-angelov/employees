import { createContext, useEffect, useState } from "react";
import {
  hasValidHeaders,
  isFileEmpty,
  isValidCSV,
  parseDate,
} from "../utils/helpers";
import { AppState, DataRow } from "./types";

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

  useEffect(() => {
    validateFile();
  }, [file]);

  useEffect(() => {
    parseData();
  }, [fileData]);

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
    const data: DataRow[] = rows.map((row) => {
      const values = row.split(",");
      return {
        empID: values[0],
        projectID: values[1],
        fromDate: values[2],
        toDate: parseDate(values[3]),
      } as DataRow;
    });
    console.log(data);
    setLoading("Mapped");
  };

  const context = {
    state,
    setFile,
    data: [],
  };
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
