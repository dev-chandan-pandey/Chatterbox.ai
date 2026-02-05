import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

if (!axios.defaults.baseURL) {
  throw new Error("VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // 🔥 THIS IS THE FIX
});

export default api;
