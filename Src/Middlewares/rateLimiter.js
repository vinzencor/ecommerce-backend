import rateLimit from "express-rate-limit";
import { sendError } from "../Utils/apiResponse.js";

/**
 * Reusable rate-limiter factory.
 * @param {object} options
 * @param {number} options.windowMs   – time window in ms
 * @param {number} options.max        – max requests per window per IP
 * @param {string} options.message    – user-facing error message
 */
const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      sendError(res, 429, message);
    },
  });



//   Resend OTP: max 5 requests per IP every 15 minutes.

export const resendOtpLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,
  message: "Too many OTP requests from this IP. Please wait 15 minutes and try again.",
});


//   Register: max 10 attempts per IP per hour.

export const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 20,
  message: "Too many registration attempts. Please try again in an hour.",
});


//  Login: max 10 attempts per IP per 15 minutes.

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts. Please wait 15 minutes and try again.",
});
