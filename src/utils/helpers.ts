import { DataRow } from "../context/types";

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

export const parseDate = (date: string): number => {
  if (date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/))
    return new Date(date).getTime();
  if (Number(date)) return Number(date);
  return new Date().getTime();
};

export const calculateOverlap = (a: DataRow, b: DataRow): number => {
  const start = a.fromDate > b.fromDate ? a.fromDate : b.fromDate;
  const end = a.toDate < b.toDate ? a.toDate : b.toDate;
  const overlap = end - start;
  if (overlap < 0) return 0;

  // todo - add constant
  return Math.floor(overlap / 1000 / 60 / 60 / 24);
};
