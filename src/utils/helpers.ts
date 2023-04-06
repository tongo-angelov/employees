export const isValidCSV = (f: File): boolean => {
  return f.type === "text/csv";
};

export const isFileEmpty = (f: File): boolean => {
  return f.size === 0;
};

export const hasValidHeaders = (header: string, headers: string[]): boolean => {
  const fileHeaders = header.split(",");
  if (fileHeaders.length !== headers.length) return false;

  let isValid = true;
  headers.forEach((header, index) => {
    if (header !== fileHeaders[index]) isValid = false;
  });
  return isValid;
};

export const parseDate = (date: string): string => {
  // todo: check if valid year/month/day (e.g. 2000-13-32)
  if (date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) return date;

  let result;
  if (Number(date)) result = new Date(Number(date));
  else result = new Date();
  return result.toJSON().slice(0, 10);
};
