import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/customError";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(
    `Route not found - ${req.originalUrl}`,
    404,
    true
  );
  next(error);
};
