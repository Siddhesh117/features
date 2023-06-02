// API CALLS RELATED TO terminal MODULE

import axios from "axios";

export const getAirportsListAPI = async (TOKEN: any) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/airport/`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching airports:", error);
    throw error;
  }
};

export const getOneAirportByIdAPI = async (TOKEN: string, id: number) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/airport/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching airport:", error);
    throw error;
  }
};

export const addAirportAPI = async (TOKEN: any, airportObj: any) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_DEV_URL}/airport/`, airportObj, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error adding airport:", error);
    throw error;
  }
};

export const updateAirportAPI = async (TOKEN: string, id: number, data: any) => {
  try {
    const response = await axios.patch(`${process.env.REACT_APP_DEV_URL}/airport/${id}`, data, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error updating airport:", error);
    throw error;
  }
};

export const deleteAirportAPI = async (TOKEN: any, id: number) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_DEV_URL}/airport/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error deleting airport:", error);
    throw error;
  }
};
