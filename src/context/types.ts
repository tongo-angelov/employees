export type AppState = {
  state: string;
  error: string;
};

export type DataRow = {
  empID: string;
  projectID: string;
  fromDate: number;
  toDate: number;
};

export type ProjectData = {
  id: string;
  pairs: ProjectPair[];
};

export type ProjectPair = {
  id: string;
  aID: string;
  bID: string;
  time: number;
};

export type EmployeePair = {
  id: string;
  aID: string;
  bID: string;
  time: number;
  projects: EmployeeProject[];
};

export type EmployeeProject = {
  id: string;
  time: number;
};
