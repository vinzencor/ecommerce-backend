import Joi from "joi";

export const createBrandSchema = Joi.object({
  brandName: Joi.string().trim().required().messages({
    "string.empty": "Brand name is required.",
    "any.required": "Brand name is required.",
  }),
  categoryId: Joi.string().uuid().required().messages({
    "string.guid": "A valid category UUID is required.",
    "any.required": "Category ID is required.",
  }),
  isActive: Joi.boolean().default(true),
});

export const updateBrandSchema = Joi.object({
  brandName: Joi.string().trim().optional(),
  categoryId: Joi.string().uuid().optional().messages({
    "string.guid": "A valid category UUID is required.",
  }),
  isActive: Joi.boolean().optional(),
});
