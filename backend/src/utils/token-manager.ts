import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn,
  });
  return token;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Token Not Received" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token Expired" });
    }

    res.locals.jwtData = decoded;
    next();
  });
};
