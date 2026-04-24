import Joi from "joi";


export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 100 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string().email().lowercase().trim().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Phone must be a valid number (7–15 digits).",
    }),

  referralCode: Joi.string().trim().optional().allow("").messages({
    "string.base": "Referral code must be a string.",
  }),

  latitude: Joi.number().min(-90).max(90).optional().messages({
    "number.base": "Latitude must be a number.",
    "number.min": "Latitude must be between -90 and 90.",
    "number.max": "Latitude must be between -90 and 90.",
  }),

  longitude: Joi.number().min(-180).max(180).optional().messages({
    "number.base": "Longitude must be a number.",
    "number.min": "Longitude must be between -180 and 180.",
    "number.max": "Longitude must be between -180 and 180.",
  }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number must be provided.",
});


export const vendorRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 100 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "any.required": "Password is required.",
  }),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(""),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Phone must be a valid number (7–15 digits).",
    }),
}).or("email", "phone").messages({
  "object.missing": "Please provide either your email or phone number to login.",
});


export const adminLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "any.required": "Password is required.",
  }),
});


export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Phone must be a valid number (7–15 digits).",
    }),

  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.length": "OTP must be exactly 6 digits.",
    "string.pattern.base": "OTP must contain only numbers.",
    "any.required": "OTP is required.",
  }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number is required to verify.",
});


export const resendOTPSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Phone must be a valid number (7–15 digits).",
    }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number is required to resend OTP.",
});


export const isDefaultSchema = Joi.object({
  isDefault: Joi.boolean().optional().messages({
    "boolean.base": "isDefault must be a boolean.",
  }),
});


export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(""),
  gender: Joi.string().valid("male", "female", "others").optional(),
});



