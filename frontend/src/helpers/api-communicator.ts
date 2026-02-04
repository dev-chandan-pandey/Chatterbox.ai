import api from "./axios";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/user/login", { email, password });
  return res.data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/user/signup", { name, email, password });
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await api.get("/user/auth-status");
  return res.data;
};

export const sendChatRequest = async (message: string) => {
  const res = await api.post("/chat/new", { message });
  return res.data;
};

export const getUserChats = async () => {
  const res = await api.get("/chat/all-chats");
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await api.delete("/chat/delete");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.get("/user/logout");
  return res.data;
};
