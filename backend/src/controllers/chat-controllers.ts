import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import Groq from "groq-sdk";

// Simple chat message type
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string,
});

// ===============================
// CREATE NEW CHAT COMPLETION
// ===============================
export const generateChatCompletion = async (
  req: Request,
  res: Response
) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    const messages: ChatMessage[] = [
      { role: "system", content: "You are a helpful assistant." },
      ...user.chats.slice(-6).map((c) => ({
        role: c.role as "user" | "assistant",
        content: c.content,
      })),
      { role: "user", content: message },
    ];

    // Save user message
    user.chats.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    const aiReply = completion.choices[0]?.message?.content;

    if (aiReply) {
      user.chats.push({
        role: "assistant",
        content: aiReply,
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      chats: user.chats,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Groq error",
    });
  }
};

// ===============================
// GET ALL USER CHATS
// ===============================
export const sendChatsToUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      chats: user.chats,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chats",
    });
  }
};

// ===============================
// DELETE ALL USER CHATS
// ===============================
export const deleteChats = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Correct way
    user.chats.splice(0, user.chats.length);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Chats deleted",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete chats",
    });
  }
};

