import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import Groq from "groq-sdk";

// Simple message type for Groq (NO OpenAI types)
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
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
      ...user.chats.slice(-6).map((chat) => ({
        role: chat.role as "user" | "assistant",
        content: chat.content,
      })),
      { role: "user", content: message },
    ];

    // save user message
    user.chats.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ ACTIVE MODEL
      messages,
    });

    const aiMessage = completion.choices[0]?.message?.content;

    if (aiMessage) {
      user.chats.push({
        role: "assistant",
        content: aiMessage,
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
      message: error.message || "Groq LLM error",
    });
  }
};



export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered OR Token malfunctioned",
      });
    }

    return res.status(200).json({
      success: true,
      chats: user.chats,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      cause: error.message,
    });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered OR Token malfunctioned",
      });
    }

    // ✅ CORRECT way to clear Mongoose DocumentArray
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
      message: "Internal server error",
      cause: error.message,
    });
  }
};
