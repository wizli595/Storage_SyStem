import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export const validateRequest =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        errors: error.details.map((err) => ({
          message: err.message,
          field: err.context?.key,
          path: err.path.join("."),
        })),
      });
      return;
    }
    next();
  };
