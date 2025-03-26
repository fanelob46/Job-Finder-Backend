import jwt from "jsonwebtoken";
import { Response } from "express";

interface JwtPayload {
  userId: string;
}

const generateToken = (res: Response, userId: string): void => {
  
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set cookie with token
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", 
    sameSite: "strict", 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    domain: process.env.COOKIE_DOMAIN, 
    path: "/", 
  });
};

export default generateToken;
