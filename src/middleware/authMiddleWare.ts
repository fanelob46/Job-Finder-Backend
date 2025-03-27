// middlewares/auth.middleware.ts
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/HttpError";
import User, { UserDocument } from "../models/user.model";
import { SanitizedUser } from "../types/user.types";
import { FORBIDDEN, UNAUTHORIZED } from "../../constants/http.codes";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

interface JwtPayload {
  userId: string;
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(UNAUTHORIZED).json({ message: "Not authorized, no token" });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      const user = await User.findById(decoded.userId)
        .select("-password")
        .lean()
        .exec();

      if (!user) {
        res
          .status(UNAUTHORIZED)
          .json({ message: "Not authorized, user not found" });
        return;
      }

      // Convert to our SanitizedUser type
      req.user = user; 

      next();
    } catch (error) {
      console.error(error);
      res
        .status(UNAUTHORIZED)
        .json({ message: "Not authorized, invalid token" });
    }
  }
);

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(FORBIDDEN);
    throw new Error("Access denied. Admins only.");
  }
};

const authorizeRoles = (...allowedRoles: ("admin" | "user")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new HttpError("Not authorized", FORBIDDEN));
    }
    next();
  };
};

export { protect, admin, authorizeRoles };
