import { createContext, useEffect, useState } from "react";
import { isFileEmpty, isValidCSV } from "../utils/helpers";

export type ContextType = {
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  error: string | null;
  data: any[];
};

export const AppContext = createContext<ContextType>({
  setFile: () => {},
  error: null,
  data: [],
});

type AppContextProviderProps = {
  children: JSX.Element;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);

  useEffect(() => {
    validateFile();
  }, [file]);

  useEffect(() => {
    parseData();
  }, [fileData]);

  const validateFile = () => {
    if (!file) return;
    setError(null);

    if (!isValidCSV(file)) {
      setError("Invalid file format!");
      return;
    }

    if (isFileEmpty(file)) {
      setError("Empty file selected!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result;
      setFileData(text ? String(text) : null);
    };
    reader.readAsText(file);
  };

  const parseData = () => {
    if (!fileData) return;

    console.log("file parsed");
    console.log(fileData);
  };

  const context = {
    setFile,
    error,
    data: [],
  };
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
