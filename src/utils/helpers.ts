export const isValidCSV = (f: File) => {
  return f.type === "text/csv";
};

export const isFileEmpty = (f: File) => {
  return f.size === 0;
};
