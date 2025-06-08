import joi from "joi";

const stockRequestValidator = joi.object({
  requester: joi.string().trim().required().messages({
    "string.empty": "Requester is required.",
  }),
  items: joi
    .array()
    .items(
      joi.object({
        itemId: joi.string().trim().required().messages({
          "string.empty": "Item ID is required.",
        }),
        requestedQuantity: joi.number().positive().required().messages({
          "number.base": "Requested quantity must be a number.",
          "number.positive": "Requested quantity must be a positive number.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one item is required.",
    }),
  justification: joi.string().allow("").optional(),
});
export default stockRequestValidator;
