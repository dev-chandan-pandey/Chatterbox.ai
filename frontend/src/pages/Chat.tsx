import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, IconButton } from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ SAFE initials (NO CRASH EVER)
  const initials =
    auth?.user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("") || "U";

  // ---------------- SEND MESSAGE ----------------
  const handleSubmit = async () => {
    if (!auth?.user || loading) return;

    const content = inputRef.current?.value?.trim();
    if (!content) return;

    if (inputRef.current) inputRef.current.value = "";

    setChatMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);

    try {
      const chatData = await sendChatRequest(content);

      if (chatData?.chats) {
        setChatMessages(chatData.chats);
      } else {
        toast.error(chatData?.message || "Failed to get response");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOAD CHATS ----------------
  useLayoutEffect(() => {
    if (!auth?.user) return;

    getUserChats()
      .then((data) => {
        if (data?.chats) setChatMessages(data.chats);
      })
      .catch(() => toast.error("Failed to load chats"));
  }, [auth?.user]);

  // ---------------- AUTH GUARD ----------------
  useEffect(() => {
    if (auth?.isLoggedIn === false) {
      navigate("/login");
    }
  }, [auth?.isLoggedIn, navigate]);

  // ---------------- DELETE CHATS ----------------
  const handleDeleteChats = async () => {
    try {
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Conversation cleared");
    } catch {
      toast.error("Failed to delete chats");
    }
  };

  if (!auth) return null;

  return (
    <Box sx={{ display: "flex", flex: 1, mt: 3, gap: 3 }}>
      {/* LEFT PANEL */}
      <Box sx={{ display: { md: "flex", xs: "none" }, flex: 0.2 }}>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            textAlign: "center",
            p: 2,
          }}
        >
          <Avatar sx={{ mx: "auto", my: 2 }}>{initials}</Avatar>
          <Button
            onClick={handleDeleteChats}
            variant="contained"
            color="error"
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* CHAT PANEL */}
      <Box sx={{ flex: 0.8 }}>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {chatMessages
  .filter((c) => c?.content && c?.role)
  .map((chat, i) => (
    <ChatItem key={i} content={chat.content} role={chat.role} />
))}

        </Box>

        {/* INPUT */}
        <Box
          sx={{
            width: "80%",
            mx: "auto",
            mt: 2,
            display: "flex",
            bgcolor: "rgb(227, 232, 238)",
            borderRadius: 2,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            disabled={!auth?.user || loading}
            style={{
              width: "100%",
              background: "transparent",
              padding: "20px",
              border: "none",
              outline: "none",
              fontSize: "18px",
            }}
            placeholder="Type your message…"
          />
          <IconButton onClick={handleSubmit} disabled={loading}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
