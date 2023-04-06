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
  data: ProjectPair[];
};

export type ProjectPair = {
  employees: EmployeePair;
  time: number;
};

export type EmployeePair = {
  aID: string;
  bID: string;
};

export type EmployeeData = {
  id: string;
  data: [
    {
      empID: string;
      time: number;
    }
  ];
};
