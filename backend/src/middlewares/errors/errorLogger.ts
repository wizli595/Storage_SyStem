import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/customError";
import chalk from "chalk";

export const errorLogger = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  if (err instanceof CustomError && !err.isOperational) {
    console.warn(
      chalk.yellow(
        `[WARNING] [${timestamp}] - ${err.message} (Status: ${statusCode})`
      )
    );
  } else {
    // Log non-operational errors in red
    console.error(
      chalk.red(
        `[CRITICAL] [${timestamp}] - ${err.message} (Status: ${statusCode})`
      )
    );
    console.error(chalk.gray(err.stack || "No stack trace available."));
  }
  next(err);
};
