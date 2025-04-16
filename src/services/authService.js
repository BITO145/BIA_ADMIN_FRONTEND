import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const loginService = async ({ username, password }) => {
  const response = await axios.post(
    `${backendUrl}/auth/login`,
    { username, password },
    {
      withCredentials: true, // Important for cookies
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const logoutService = async () => {
  const response = await axios.post(
    `${backendUrl}/auth/logout`,
    {}, // No data in the body
    { withCredentials: true } // Config object with withCredentials true
  );
  return response.data;
};
