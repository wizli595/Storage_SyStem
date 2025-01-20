import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/customError";
import logger from "../../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`[ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
