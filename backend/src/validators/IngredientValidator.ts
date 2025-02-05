import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const ingredientSchema = Joi.object({
  plateId: Joi.string().trim().required().messages({
    "string.empty": "Plate ID is required",
  }),
  itemId: Joi.string().trim().required().messages({
    "string.empty": "Item ID is required",
  }),
  quantity: Joi.number().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.positive": "Quantity must be greater than 0",
  }),
});

export default ingredientSchema;
