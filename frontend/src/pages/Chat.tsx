import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // ✅ SAFE initials (NO CRASH POSSIBLE)
  const initials =
    auth?.user?.name
      ?.split(" ")
      ?.filter(Boolean)
      ?.map((n) => n[0])
      ?.join("") || "";

  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content) return;

    if (inputRef.current) inputRef.current.value = "";

    setChatMessages((prev) => [...prev, { role: "user", content }]);

    const chatData = await sendChatRequest(content);

    if (chatData?.chats) {
      setChatMessages(chatData.chats);
    } else {
      toast.error(chatData?.message || "Failed to get response");
    }
  };

  useLayoutEffect(() => {
    if (!auth?.user) return;

    getUserChats()
      .then((data) => {
        if (data?.chats) setChatMessages(data.chats);
      })
      .catch(() => toast.error("Failed to load chats"));
  }, [auth?.user]);

  useEffect(() => {
    if (auth?.isLoggedIn === false) {
      navigate("/login");
    }
  }, [auth?.isLoggedIn, navigate]);

  if (!auth) return null;

  return (
    <Box sx={{ display: "flex", flex: 1, mt: 3, gap: 3 }}>
      <Box sx={{ display: { md: "flex", xs: "none" }, flex: 0.2 }}>
        <Box sx={{ width: "100%", height: "60vh", bgcolor: "rgb(17,29,39)", borderRadius: 5 }}>
          <Avatar sx={{ mx: "auto", my: 2 }}>{initials}</Avatar>
          <Button onClick={deleteUserChats}>Clear Conversation</Button>
        </Box>
      </Box>

      <Box sx={{ flex: 0.8 }}>
        <Box 
        sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, i) => (
            <ChatItem key={i} content={chat.content} role={chat.role} />
          ))}
        </Box>

        <Box sx={{ display: "flex" }}
        style={{
            width: "80%",
            borderRadius: 8,
            backgroundColor: "rgb(227, 232, 238)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input ref={inputRef}
          type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "black",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
