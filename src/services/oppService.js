// src/services/oppService.js

import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createOppService = async (formData) => {
  const response = await axios.post(`${backendUrl}/sa/createOpp`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // ✅ Required to send cookie
  });
  return response.data.opportunity;
};

export const getOppService = async () => {
  const response = await axios.get(`${backendUrl}/sa/get-opp`, {
    withCredentials: true,
  });
  return response.data;
};
