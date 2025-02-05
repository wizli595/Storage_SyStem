import Joi from "joi";

const PlateSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Plate name is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.positive": "Plate price must be positive",
    "number.base": "Plate price is required",
  }),
});
export default PlateSchema;
