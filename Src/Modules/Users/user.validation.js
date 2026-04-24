import Joi from "joi";

export const toggleUserStatusSchema = Joi.object({
    isActive: Joi.boolean().required().messages({
        "any.required": "isActive status is required.",
        "boolean.base": "isActive must be a boolean."
    }),
});
