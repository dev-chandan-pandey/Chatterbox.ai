import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

// 🔐 detect production (Render)
const isProduction = process.env.NODE_ENV === "production";

// 🍪 shared cookie options (IMPORTANT)
const cookieOptions = {
  httpOnly: true,
  signed: true,
  path: "/",
  secure: true,               // REQUIRED on Render (HTTPS)
  sameSite: "none" as const,  // REQUIRED for Vercel → Render
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // clear old cookie (if any)
    res.clearCookie(COOKIE_NAME, cookieOptions);

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // set auth cookie
    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      expires,
    });

    return res.status(201).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    // clear old cookie
    res.clearCookie(COOKIE_NAME, cookieOptions);

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // set auth cookie
    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      expires,
    });

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR token invalid" });
    }

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // clear auth cookie
    res.clearCookie(COOKIE_NAME, cookieOptions);

    return res.status(200).json({ message: "OK" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
