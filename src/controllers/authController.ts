import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { loginUser, registerUser, updateProfile } from "../service/authService";
import generateToken from "../utils/generateToken";
import User, { UserDocument } from "../models/user.model";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http.codes";
import { HttpError } from "../utils/HttpError";

// Extend Express Request type with user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export const registHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await registerUser(req.body);

      // Ensure _id is properly typed as string
      const userId = user._id.toString();
      await generateToken(res, userId);

      const data = new User(user);

      res.status(CREATED).json({
        message: "User successfully registered",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const loginHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await loginUser(req.body);

      // Convert ObjectId to string
      const userId = user._id.toString();
      await generateToken(res, userId);

      const data = new User(user);

      res.status(OK).json({
        message: "Successfully logged in",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const logoutHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(OK).json({
        success: true,
        message: "Sad to see you go",
      });
    } catch (error) {
      next(error);
    }
  }
);

export const updateProfileHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new HttpError("User not authenticated", UNAUTHORIZED);
      }

      const updateData = {
        userId: req.user._id.toString(), // Convert to string
        ...req.body,
      };

      const updatedUser = await updateProfile(updateData);
      await generateToken(res, updatedUser._id.toString());

      const data = new User(updatedUser);

      res.status(OK).json({
        message: "Profile updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);
