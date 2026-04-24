import Joi from "joi";

export const createVariantNameSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Variant name is required.",
    }),
    inputType: Joi.string().valid("TEXT", "COLOR", "SELECT").default("SELECT"),
    isRequired: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true),
    displayLabel: Joi.string().trim().default("Select"),
    categoryId: Joi.string().uuid().optional(),
});

export const updateVariantNameSchema = Joi.object({
    name: Joi.string().trim().optional(),
    inputType: Joi.string().valid("TEXT", "COLOR", "SELECT").optional(),
    isRequired: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    displayLabel: Joi.string().trim().optional(),
    categoryId: Joi.string().uuid().optional(),
});

export const createVariantValueSchema = Joi.object({
    variantNameId: Joi.string().uuid().required().messages({
        "string.empty": "Variant Name ID is required.",
    }),
    value: Joi.string().trim().required().messages({
        "string.empty": "Variant value is required.",
    }),
    colorCode: Joi.string().trim().optional().allow(null, ""),
});

export const updateVariantValueSchema = Joi.object({
    value: Joi.string().trim().optional(),
    colorCode: Joi.string().trim().optional().allow(null, ""),
    isActive: Joi.boolean().optional(),
});
