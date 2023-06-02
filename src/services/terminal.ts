// API CALLS RELATED TO terminal MODULE

import axios from "axios";

export const getTerminalsListAPI = async (TOKEN: any) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/terminal/`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching terminals:", error);
    throw error;
  }
};

export const getOneTerminalByIdAPI = async (TOKEN:string, id: number) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/terminal/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching terminal:", error);
    throw error;
  }
};

export const addTerminalAPI = async (TOKEN: any, airportObj: any) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_DEV_URL}/terminal/`, airportObj, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error adding terminal:", error);
    throw error;
  }
};

export const updateTerminalAPI = async (TOKEN: string, id: number, data: any) => {
  try {
    const response = await axios.patch(`${process.env.REACT_APP_DEV_URL}/terminal/${id}`, data, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error updating terminal:", error);
    throw error;
  }
};

export const deleteTerminalAPI = async (id: number, TOKEN: string) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_DEV_URL}/terminal/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error deleting terminal:", error);
    throw error;
  }
};
