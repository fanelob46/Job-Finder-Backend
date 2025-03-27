import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import updateUserSchema from "../schemas/updateUserSchema";

const validateUpdateUser = asyncHandler(async(req : Request, res: Response,next: NextFunction) => {
    const result = updateUserSchema.safeParse(req.body);
    
        if (!result.success) {
          return next(result.error); // Pass error to the error handler
        }
    
        // If validation passes, attach validated data to req.body
        req.body = result.data;
    
        next(); // Proceed to the next middleware/handler if validation passes
      
})

export default validateUpdateUser;