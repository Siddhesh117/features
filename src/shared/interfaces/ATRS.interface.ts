interface SortInfo {
  columnKey: string | undefined;
  order: string | undefined;
}

interface ATRSInputData {
  id?: number | null;
  name: string;
  terminal_id: number;
  terminal_name: string;
  airport_id: number;
  airport_name: string;
}

interface ATRSData {
  id?: number | null;
  name: string;
  terminal: {
    id: number;
    name: string;
    airport: {
      id: number;
      name: string;
    };
  };
}

interface ATRSDetailsData {
  id: number;
  name: string;
  terminal: {
    id: number;
    name: string;
    airport: {
      id: number;
      name: string;
    };
  };
}

interface FormattedData {
  id?: number;
  name: string;
  airport: {
    id: number;
    name: string;
  };
  terminal: {
    id: number;
    name: string;
  };
}

export type { SortInfo, ATRSData, ATRSDetailsData, FormattedData, ATRSInputData };
