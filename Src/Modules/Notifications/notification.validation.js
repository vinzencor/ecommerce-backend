import Joi from "joi";

const createNotificationSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),
  message: Joi.string().required().messages({
    "string.empty": "Message is required.",
    "any.required": "Message is required.",
  }),
  image: Joi.string().allow("", null).optional(),
  sentAt: Joi.date().min('now').optional().messages({
    "date.min": "Schedule date cannot be in the past.",
    "date.base": "Invalid date format for sentAt."
  }),
  audience: Joi.string().valid("all", "selected").optional().messages({
    "any.only": "Audience must be either 'all' or 'selected'.",
  }),
  selectedUsers: Joi.alternatives().try(
    Joi.array().items(Joi.string().guid()).min(1),
    Joi.string()
  ).optional().messages({
    "array.min": "At least one user must be selected.",
  }),
});

export { createNotificationSchema };
