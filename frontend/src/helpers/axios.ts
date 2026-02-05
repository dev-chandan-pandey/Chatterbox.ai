import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ ONLY THIS
  withCredentials: true,                 // ✅ REQUIRED for cookies
});

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export default api;
