import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://mymoo-backend-production.up.railway.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
export { API_BASE_URL };
