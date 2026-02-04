import axios from "axios";

/**
 * Axios instance
 * - withCredentials is REQUIRED for cookie-based auth
 * - baseURL switches automatically between dev & prod
 */
const api = axios.create({
  baseURL:
    import.meta.env.PROD
      ? "https://chatterbox-ai-q6pj.onrender.com/api/v1"
      : "http://localhost:5000/api/v1",
  withCredentials: true,
});

// ---------------- AUTH ----------------

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/user/login", { email, password });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Unable to login",
    };
  }
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await api.post("/user/signup", { name, email, password });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Unable to signup",
    };
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await api.get("/user/auth-status");
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.get("/user/logout");
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: "Logout failed",
    };
  }
};

// ---------------- CHAT ----------------

export const sendChatRequest = async (message: string) => {
  try {
    const res = await api.post("/chat/new", { message });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to send message",
    };
  }
};

export const getUserChats = async () => {
  try {
    const res = await api.get("/chat/all-chats");
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: "Failed to load chats",
    };
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await api.delete("/chat/delete");
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: "Failed to delete chats",
    };
  }
};
