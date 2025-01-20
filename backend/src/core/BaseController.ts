import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

import { CustomError } from "../utils/customError";

export default abstract class BaseController {
  /**
   * Executes an asynchronous function without error handling.
   * @param func - The function to execute.
   * @returns The result of the function.
   */
  protected async executeAsync<T>(func: () => Promise<T>): Promise<T> {
    return await func();
  }

  /**
   * Executes an asynchronous function with error handling and logging.
   * @param func - The function to execute.
   * @returns The result of the function.
   * @throws The caught error after logging.
   */
  protected async executeAsyncWithCatch<T>(func: () => Promise<T>): Promise<T> {
    try {
      return await func();
    } catch (error) {
      logger.error("Error in BaseController:", error);
      throw new CustomError("Internal Server Error", 500, false);
    }
  }

  /**
   * Handles an API request, executes the provided function, and sends a standardized JSON response.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   * @param func - The function to execute.
   */
  protected async handleRequest<T>(
    req: Request,
    res: Response,
    next: NextFunction,
    func: () => Promise<T>
  ): Promise<void> {
    try {
      const data = await func();
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error("Request failed:", {
        method: req.method,
        url: req.originalUrl,
        error,
      });
      next(error);
    }
  }
}
