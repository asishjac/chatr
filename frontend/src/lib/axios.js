import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api" || "https://api.chatr.local/api",
  withCredentials: true,
  timeout: 10000,
});
