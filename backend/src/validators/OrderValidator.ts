import Joi from "joi";

const orderSchema = Joi.object({
  plateId: Joi.string().trim().required().messages({
    "string.empty": "Plate ID is required",
  }),
  quantity: Joi.number().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.positive": "Quantity must be greater than 0",
  }),
});

export default orderSchema;
