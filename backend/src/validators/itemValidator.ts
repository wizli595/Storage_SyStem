import joi from "joi";

export const itemSchema = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  quantity: joi.number().required().messages({
    "number.base": "Quantity must be a number",
  }),
  unit: joi.string().required().messages({
    "string.empty": "Unit is required",
  }),
});
