import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // 🔥 THIS IS THE FIX
});

export default api;
