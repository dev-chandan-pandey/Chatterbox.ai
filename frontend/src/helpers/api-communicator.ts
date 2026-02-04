import axios from "axios";
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("/user/login", { email, password });
    return res.data;
  } catch (err: any) {
    return { message: err.response?.data?.message || "Unable to login" };
  }
};
export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  try {
    const res = await axios.post("/chat/new", { message });
    return res.data; // success case
  } catch (err: any) {
    if (err.response) {
      // return backend error message if available
      return { message: err.response.data.message || "Request failed" };
    }
    return { message: "Network error" };
  }
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};
