import Joi from "joi";

export const stockLogSchema = Joi.object({
  itemId: Joi.string().required().messages({
    "string.empty": "Item ID is required",
  }),
  quantity: Joi.number().required().messages({
    "number.base": "Quantity must be a number",
  }),
  actionBy: Joi.string().required().messages({
    "string.empty": "ActionBy is required",
  }),
});
