import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../constants/http.codes";
import { ZodError } from "zod";
import { NODE_ENV } from "../../constants/env.const";

interface ZodErrorResponse {
  statusCode: number;
  body: {
    errors: Array<{
      path: string;
      message: string;
    }>;
    message: string;
  };
}

const notFound = (req: Request, res : Response, next: NextFunction): void => {
    const error = new HttpError(`${req.originalUrl} : Not Found`, NOT_FOUND);
    next(error);
}

const handleZodError = (err: ZodError): ZodErrorResponse => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: BAD_REQUEST,
    body: {
      errors,
      message: "Validation Error",
    },
  };
};

const errorHandler = (
  err: Error | HttpError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error(err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  if (err instanceof ZodError) {
    const { statusCode, body } = handleZodError(err);
    return res.status(statusCode).json(body);
  }

  return res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { errorHandler, notFound };