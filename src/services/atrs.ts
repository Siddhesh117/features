// API CALLS RELATED TO terminal MODULE

import axios from "axios";

export const getATRSListAPI = async (TOKEN: any) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/atrs/`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching atrs:", error);
    throw error;
  }
};

export const getOneATRSByIdAPI = async (TOKEN: any, id: number) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/atrs/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching atrs:", error);
    throw error;
  }
};

export const addATRSAPI = async (TOKEN: any, atrsObj: any) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_DEV_URL}/atrs/`, atrsObj, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error adding atrs:", error);
    throw error;
  }
};

export const updateATRSAPI = async (TOKEN: string, id: number, data: any) => {
  try {
    const response = await axios.patch(`${process.env.REACT_APP_DEV_URL}/atrs/${id}`, data, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error Updating atrs:", error);
    throw error;
  }
};

export const deleteATRSAPI = async (id: number, TOKEN: string) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_DEV_URL}/atrs/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error Deleting atrs:", error);
    throw error;
  }
};

export const getAirportByTerminalListAPI = async (TOKEN: any, id: number) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_DEV_URL}/terminal/terminalByAirportId/${id}`, {
      headers: {
        authorization: `Bearer ${TOKEN}`
      }
    });
    if (response.status !== 200) throw new Error("Please check your user credentials.");
    return response.data;
  } catch (error) {
    console.error("Error fetching AirportByTerminals List:", error);
    throw error;
  }
};
