import { sendError } from "../Utils/apiResponse.js";

/**
 *
 * @param {import('joi').ObjectSchema} schema – Joi schema to validate against
 */
const validate = (schema) => (req, res, next) => {
  
  if (!req.body || Object.keys(req.body).length === 0) {
    // If it's a GET request without a body, that's often okay, 
    // but for POST/PATCH it's usually a mistake and Joi should catch it.
  }

  const { error, value } = schema.validate(req.body || {}, { abortEarly: false, stripUnknown: true });
  
  if (error) {
    const errors = error.details.map((d) => d.message.replace(/\"/g, ""));
    return sendError(res, 422, "Validation failed.", errors);
  }

  // Update req.body with validated/coerced values
  req.body = value;
  next();
};

export default validate;
