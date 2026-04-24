import Joi from "joi";

export const createDealSchema = Joi.object({
    productId: Joi.string().uuid().required().messages({
        "string.guid": "Valid product ID (UUID) is required.",
        "any.required": "Product ID is required.",
    }),
    discountType: Joi.string().valid("PERCENTAGE", "FLAT").required().messages({
        "any.only": "Discount type must be either PERCENTAGE or FLAT.",
        "any.required": "Discount type is required.",
    }),
    discountValue: Joi.number().min(0).required().messages({
        "number.base": "Discount value must be a number.",
        "number.min": "Discount value cannot be negative.",
        "any.required": "Discount value is required.",
    }),
    date: Joi.date().required().messages({
        "date.base": "A valid date is required for the deal.",
        "any.required": "Deal date is required.",
    }),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    isActive: Joi.boolean().default(true),
});

export const updateDealSchema = Joi.object({
    productId: Joi.string().uuid().optional(),
    discountType: Joi.string().valid("PERCENTAGE", "FLAT").optional(),
    discountValue: Joi.number().min(0).optional(),
    date: Joi.date().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    isActive: Joi.boolean().optional(),
});
