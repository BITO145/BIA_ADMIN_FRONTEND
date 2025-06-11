import axios from "axios";

const API = import.meta.env.VITE_MEMBERSHIP_API_URL; // e.g. "http://localhost:8000"

export const getStats = () =>
  axios.get(`${API}/admin/membership-stats`).then((r) => r.data);

export const getTransactions = () =>
  axios.get(`${API}/admin/membership-transactions`).then((r) => r.data);
