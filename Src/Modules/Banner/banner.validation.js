import Joi from 'joi';

export const createBannerSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required.',
  }),
  type: Joi.string().valid('HOME', 'CATEGORY', 'OFFER', 'OTHER').default('HOME'),
  linkType: Joi.string()
    .valid('PRODUCT', 'CATEGORY', 'EXTERNAL', 'NONE')
    .default('NONE'),
  linkValue: Joi.string().allow(null, ''),
  startDate: Joi.date().iso().min('now').allow(null).messages({
    'date.min': 'Start date cannot be in the past.',
  }),
  endDate: Joi.date().iso().min('now').greater(Joi.ref('startDate')).allow(null).messages({
    'date.min': 'End date cannot be in the past.',
    'date.greater': 'End date must be after the start date.',
  }),
  productIds: Joi.array().items(Joi.string().uuid()).allow(null),
  isActive: Joi.boolean().default(true),
});

export const updateBannerSchema = Joi.object({
  title: Joi.string(),
  type: Joi.string().valid('HOME', 'CATEGORY', 'OFFER', 'OTHER'),
  linkType: Joi.string().valid('PRODUCT', 'CATEGORY', 'EXTERNAL', 'NONE'),
  linkValue: Joi.string().allow(null, ''),
  startDate: Joi.date().iso().min('now').allow(null).messages({
    'date.min': 'Start date cannot be in the past.',
  }),
  endDate: Joi.date().iso().min('now').greater(Joi.ref('startDate')).allow(null).messages({
    'date.min': 'End date cannot be in the past.',
    'date.greater': 'End date must be after the start date.',
  }),
  productIds: Joi.array().items(Joi.string().uuid()).allow(null),
  isActive: Joi.boolean(),
});
