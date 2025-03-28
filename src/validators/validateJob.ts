import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { jobSchema } from "../schemas/jobSchema";

const validateJob = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = jobSchema.safeParse(req.body);

    if (!result.success) {
      return next(result.error); // Pass error to the error handler
    }

    // If validation passes, attach validated data to req.body
    req.body = result.data;

    next(); // Proceed to the next middleware/handler if validation passes
  }
);

export default validateJob;
