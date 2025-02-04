import { Response, Request, NextFunction } from "express";
import { CustomError } from "../../utils/customError";
import { env } from "../../config";
export const errorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message =
    err instanceof CustomError && err.isOperational
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
  });
};
