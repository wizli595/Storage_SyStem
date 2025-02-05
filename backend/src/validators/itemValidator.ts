import joi from "joi";

export const itemSchema = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  stock: joi.number().required().messages({
    "number.base": "stock must be a number",
  }),
  unit: joi.string().required().messages({
    "string.empty": "Unit is required",
  }),
});
