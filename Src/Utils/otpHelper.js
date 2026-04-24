import crypto from "crypto";

/**
 * @returns {string}  
 */
export const generateOTP = () => {
  return String(crypto.randomInt(100000, 999999));
};

/**
 * Calculate OTP expiry time (default: 5 minutes from now).
 * @param {number} minutesFromNow
 * @returns {Date}
 */
export const otpExpiresAt = (minutesFromNow = 5) => {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
};

/**
 * @param {Date} expiresAt
 * @returns {boolean}
 */
export const isOTPExpired = (expiresAt) => {
  return !expiresAt || new Date() > new Date(expiresAt);
};
