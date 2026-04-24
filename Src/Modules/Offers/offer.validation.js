import Joi from "joi";

export const createOfferSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required.",
    }),
    description: Joi.string().allow(null, ""),
    discountType: Joi.string().valid("PERCENTAGE", "FLAT").required().messages({
        "any.only": "Discount type must be either PERCENTAGE or FLAT.",
    }),
    discountValue: Joi.number().positive().required().messages({
        "number.base": "Discount value must be a number.",
        "number.positive": "Discount value must be greater than zero.",
    }),
    startDate: Joi.date().iso().required().messages({
        "date.base": "Valid start date is required (ISO format).",
    }),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
        "date.base": "Valid end date is required (ISO format).",
        "date.greater": "End date must be after the start date.",
    }),
    productIds: Joi.alternatives().try(
        Joi.array().items(Joi.string().uuid()).min(1),
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    return helpers.error("array.min");
                }
                const uuidCheck = parsed.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
                if (!uuidCheck) return helpers.error("string.guid");
                return parsed;
            } catch (e) {
                return helpers.error("any.invalid");
            }
        })
    ).required().messages({
        "array.min": "At least one product must be associated with this offer.",
        "string.guid": "Each product ID must be a valid UUID.",
        "any.invalid": "productIds must be a valid array or JSON string of UUIDs."
    }),
    isActive: Joi.boolean().default(true),
    image: Joi.string().optional().allow(null, ""),
});

export const updateOfferSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(null, ""),
    discountType: Joi.string().valid("PERCENTAGE", "FLAT"),
    discountValue: Joi.number().positive(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")),
    productIds: Joi.alternatives().try(
        Joi.array().items(Joi.string().uuid()).min(1),
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    return helpers.error("array.min");
                }
                const uuidCheck = parsed.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
                if (!uuidCheck) return helpers.error("string.guid");
                return parsed;
            } catch (e) {
                return helpers.error("any.invalid");
            }
        })
    ).messages({
        "array.min": "At least one product must be associated with this offer.",
        "string.guid": "Each product ID must be a valid UUID.",
    }),
    isActive: Joi.boolean(),
    image: Joi.string().optional().allow(null, ""),
});
