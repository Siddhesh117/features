interface SortInfo {
  columnKey: string | undefined;
  order: string | undefined;
}

interface TerminalInputData {
  airport: {
    id: number;
    name: string;
  };
  id?: number | null;
  name: string;
}

interface TerminalsData {
  airport_id: number;
  airport_name: string;
  id?: number | null;
  name: string;
}

interface TerminalsDetailsData {
  airport_id: number;
  airport_name: string;
  id: number | null;
  name: string;
}

interface TerminalResponse {
  message: string;
  terminal: {
    airport_id: number;
    created_by: number;
    created_on: string;
    id: number;
    name: string;
    updated_by?: number;
    updated_on?: string;
  };
}

export type { SortInfo, TerminalsData, TerminalsDetailsData, TerminalResponse, TerminalInputData };
