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

  // ✅ SAFE initials generation
  const initials =
    auth?.user?.name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("") || "";

  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content) return;

    if (inputRef.current) inputRef.current.value = "";

    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const chatData = await sendChatRequest(content);

      if (chatData?.chats) {
        setChatMessages(chatData.chats);
      } else {
        toast.error(chatData?.message || "Failed to get response");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.error(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  // ✅ Load chats only when user is ready
  useLayoutEffect(() => {
    if (!auth?.user) return;

    toast.loading("Loading Chats", { id: "loadchats" });
    getUserChats()
      .then((data) => {
        if (data?.chats) {
          setChatMessages(data.chats);
        }
        toast.success("Successfully loaded chats", { id: "loadchats" });
      })
      .catch(() => {
        toast.error("Loading Failed", { id: "loadchats" });
      });
  }, [auth?.user]);

  // ✅ Redirect only when auth check finished
  useEffect(() => {
    if (auth?.isLoggedIn === false) {
      navigate("/login");
    }
  }, [auth?.isLoggedIn, navigate]);

  // ✅ Prevent render until auth resolved
  if (!auth) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>

          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>

          <Typography sx={{ mx: "auto", my: 4, p: 3 }}>
            You can ask questions related to Knowledge, Business, Advice,
            Education, etc. Avoid sharing personal information.
          </Typography>

          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": { bgcolor: red.A400 },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Chat Model
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem
              key={index}
              content={chat.content}
              role={chat.role}
            />
          ))}
        </Box>

        {/* Input */}
        <Box
          sx={{
            width: "100%",
            borderRadius: 2,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            mt: 2,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "20px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "18px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
