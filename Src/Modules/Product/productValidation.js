import Joi from "joi";

// Helper for common optional string fields
const stringOptional = Joi.string().allow("", null).optional();
const booleanOptional = Joi.boolean().optional();
const numberOptional = Joi.number().optional();
const intOptional = Joi.number().integer().min(0).optional();

export const createProductSchema = Joi.object({
  productName: Joi.string().trim().required().messages({
    "string.empty": "Product name is required.",
    "any.required": "Product name is required.",
  }),
  categoryId: Joi.string().uuid().required().messages({
    "string.guid": "Valid category ID (UUID) is required.",
    "any.required": "Category ID is required.",
  }),
  
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  brandId: Joi.string().uuid().allow("", null).optional(),
  highlights: Joi.alternatives().try(Joi.array(), Joi.object(), Joi.string()).optional(),
  searchKeywords: Joi.alternatives().try(Joi.array().items(Joi.string().trim()), Joi.string()).optional(),
  
  vendorId: Joi.string().uuid().allow("", null).optional(),
  shopId: Joi.string().uuid().allow("", null).optional(),

  taxPercentage: Joi.number().min(0).required().messages({
    "number.base": "Tax percentage must be a number.",
    "number.min": "Tax percentage cannot be negative.",
    "any.required": "Tax percentage is required.",
  }),
  
  codAllowed: booleanOptional,
  codExtraCharge: numberOptional,

  returnAllowed: booleanOptional,
  returnDays: intOptional,

  lowStock: intOptional,

  addedByAdmin: booleanOptional,
  isFeatured: booleanOptional,
  isActive: booleanOptional,
  variants: Joi.alternatives().try(
      Joi.array().items(Joi.object({
          sku: Joi.string().required().messages({
              "string.empty": "Variant SKU is required.",
              "any.required": "Variant SKU is required."
          }),
          selections: Joi.array().items(Joi.object({
              variantNameId: Joi.string().uuid().required(),
              variantValueId: Joi.string().uuid().optional(),
              value: Joi.string().trim().optional(),
              colorCode: Joi.string().allow("", null).optional()
          }).or("variantValueId", "value")).optional(),
          costPrice: Joi.number().min(0).optional(),
          price: Joi.number().min(0).required().messages({
              "number.base": "Variant price must be a number.",
              "any.required": "Variant price is required."
          }),
          discount: Joi.number().min(0).default(0),
          discountedPrice: Joi.number().min(0).optional(),
          expiryDate: Joi.date().min('now').allow("", null).optional().messages({
              "date.min": "Expiry date cannot be in the past."
          }),
          manufactureDate: Joi.date().allow("", null).optional(),
          stock: Joi.number().integer().min(0).required().messages({
              "number.base": "Variant stock must be a number.",
              "any.required": "Variant stock is required."
          }),
          isPrimary: Joi.boolean().default(false),
          images: Joi.array().items(Joi.string()).optional(),
          videos: Joi.array().items(Joi.string()).optional()
      })),
      Joi.string()
  ).optional(),
});

// Update schema makes all fields optional
export const updateProductSchema = Joi.object({
    productName: Joi.string().trim().optional(),
    categoryId: Joi.string().uuid().optional(),
    
    description: stringOptional,
    brandId: Joi.string().uuid().allow("", null).optional(),
    highlights: Joi.alternatives().try(Joi.array(), Joi.object(), Joi.string()).optional(),
    searchKeywords: Joi.alternatives().try(Joi.array().items(Joi.string().trim()), Joi.string()).optional(),
    
    vendorId: Joi.string().uuid().allow("", null).optional(),
    shopId: Joi.string().uuid().allow("", null).optional(),
  
    taxPercentage: Joi.number().min(0).optional().messages({
      "number.min": "Tax percentage cannot be negative.",
    }),
    
    codAllowed: booleanOptional,
    codExtraCharge: numberOptional,
  
    returnAllowed: booleanOptional,
    returnDays: intOptional,
  
    lowStock: intOptional,
  
    addedByAdmin: booleanOptional,
    isFeatured: booleanOptional,
    isActive: booleanOptional,
    variants: Joi.alternatives().try(
        Joi.array().items(Joi.object({
            id: Joi.string().uuid().optional(),
            sku: Joi.string().optional(),
            selections: Joi.array().items(Joi.object({
                variantNameId: Joi.string().uuid().required(),
                variantValueId: Joi.string().uuid().optional(),
                value: Joi.string().trim().optional(),
                colorCode: Joi.string().allow("", null).optional()
            }).or("variantValueId", "value")).optional(),
            costPrice: Joi.number().min(0).optional(),
            price: Joi.number().min(0).optional(),
            discount: Joi.number().min(0).optional(),
            discountedPrice: Joi.number().min(0).optional(),
            expiryDate: Joi.date().min('now').optional().messages({
                "date.min": "Expiry date cannot be in the past."
            }),
            manufactureDate: Joi.date().allow("", null).optional(),
            stock: Joi.number().integer().min(0).optional(),
            isPrimary: Joi.boolean().optional(),
            images: Joi.array().items(Joi.string()).optional(),
            videos: Joi.array().items(Joi.string()).optional()
        })),
        Joi.string()
    ).optional(),
});

export const createVariantSchema = Joi.object({
    productId: Joi.string().uuid().required().messages({
        "string.guid": "Valid product ID (UUID) is required.",
        "any.required": "Product ID is required.",
    }),
    sku: Joi.string().required().messages({
        "string.empty": "Variant SKU is required.",
        "any.required": "Variant SKU is required."
    }),
    selections: Joi.array().items(Joi.object({
        variantNameId: Joi.string().uuid().required(),
        variantValueId: Joi.string().uuid().optional(),
        value: Joi.string().trim().optional(),
        colorCode: Joi.string().allow("", null).optional()
    }).or("variantValueId", "value")).optional(),
    costPrice: Joi.number().min(0).optional(),
    price: Joi.number().min(0).required().messages({
        "number.base": "Variant price must be a number.",
        "any.required": "Variant price is required."
    }),
    discount: Joi.number().min(0).default(0),
    discountedPrice: Joi.number().min(0).optional(),
    expiryDate: Joi.date().min('now').allow("", null).optional().messages({
        "date.min": "Expiry date cannot be in the past."
    }),
    manufactureDate: Joi.date().allow("", null).optional(),
    stock: Joi.number().integer().min(0).required().messages({
        "number.base": "Variant stock must be a number.",
        "any.required": "Variant stock is required."
    }),
    isPrimary: Joi.boolean().default(false)
});
