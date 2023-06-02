interface SortInfo {
  columnKey: string | undefined;
  order: string | undefined;
}

interface AirportsData {
  id?: number | null;
  name: string;
  location: string;
  city: string;
  state: string;
}

interface AirportsDetailsData {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
}

interface AirportResponse {
  message: string;
  airport: {
    city: string;
    created_by: number;
    created_on: string;
    id: number;
    location: string;
    name: string;
    state: string;
    updated_by?: number;
    updated_on?: string;
  };
}

export type { SortInfo, AirportsData, AirportsDetailsData, AirportResponse };
