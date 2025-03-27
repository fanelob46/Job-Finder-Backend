import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { registerSchema } from "../schemas/authSchema";

const validatRegister = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return next(result.error); // Pass error to the error handler
    }

    // If validation passes, attach validated data to req.body
    req.body = result.data;

    next();
})

export default validatRegister;