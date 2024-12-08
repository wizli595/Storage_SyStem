import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/customError";

export const errorLogger = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError && !err.isOperational) {
    console.error(`[${new Date().toISOString}] - ${err.message}`);
    console.log(err.stack);
  } else {
    console.warn(`[WARNING] ${err.message}`);
  }
  next(err);
};
