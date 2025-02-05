import Joi from "joi";

export const approveSchema = Joi.object({
  approvedQuantity: Joi.number().positive().required().messages({
    "number.base": "Approved quantity must be a number",
    "number.positive": "Approved quantity must be greater than 0",
  }),
});

export const issueSchema = Joi.object({
  issuedQuantity: Joi.number().positive().required().messages({
    "number.base": "Issued quantity must be a number",
    "number.positive": "Issued quantity must be greater than 0",
  }),
});
