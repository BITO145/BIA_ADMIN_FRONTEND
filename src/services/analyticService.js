import axios from "axios";

const API = import.meta.env.VITE_MEMBERSHIP_API_URL; // e.g. "http://localhost:8000"
// console.log("API", API);
export const getStats = () =>
  axios.get(`${API}/api/admin/membership-stats`).then((r) => r.data);

export const getTransactions = () =>
  axios.get(`${API}/api/admin/membership-transactions`).then((r) => r.data);

export const getMembers = () =>
  axios.get(`${API}/api/admin/membersList`).then((r) => r.data);
