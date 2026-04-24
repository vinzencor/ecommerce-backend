import Joi from "joi";

export const createCoupanSchema = Joi.object({
    code: Joi.string().required(),
    discountType: Joi.string().valid("FLAT", "PERCENTAGE").required(),
    discountValue: Joi.number().required(),
    minOrderAmount: Joi.number().optional().allow(null),
    maxDiscountAmount: Joi.number().optional().allow(null),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    usageLimit: Joi.number().optional().allow(null),
    usedCount: Joi.number().optional().default(0),
    isActive: Joi.boolean().optional().default(true),
});

export const updateCoupanSchema = Joi.object({
    code: Joi.string().optional(),
    discountType: Joi.string().valid("FLAT", "PERCENTAGE").optional(),
    discountValue: Joi.number().optional(),
    minOrderAmount: Joi.number().optional().allow(null),
    maxDiscountAmount: Joi.number().optional().allow(null),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    usageLimit: Joi.number().optional().allow(null),
    isActive: Joi.boolean().optional(),
});
