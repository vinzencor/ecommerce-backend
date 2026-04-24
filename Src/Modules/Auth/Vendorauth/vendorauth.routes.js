import express from "express";
import vendorAuthContainer from "./vendorauth.container.js";
const { vendorAuthController } = vendorAuthContainer;
import validate from "../../../Middlewares/validate.js";
import { vendorRegisterSchema, adminLoginSchema, verifyEmailSchema, resendOTPSchema } from "../../../Utils/authValidation.js";
import { resendOtpLimiter, registerLimiter, loginLimiter } from "../../../Middlewares/rateLimiter.js";
import vendorAuthenticate from "../../../Middlewares/vendorAuthenticate.js";
import upload from "../../../Middlewares/upload.js";

const router = express.Router();

// public routes

router.post("/register",registerLimiter, validate(vendorRegisterSchema), vendorAuthController.register);

router.post("/verify-email", validate(verifyEmailSchema), vendorAuthController.verifyEmail);

router.post("/resend-otp", resendOtpLimiter, validate(resendOTPSchema), vendorAuthController.resendOTP);

router.post("/login", loginLimiter, validate(adminLoginSchema), vendorAuthController.login);

router.post("/refresh-token", vendorAuthController.refreshToken);

router.post("/logout", vendorAuthController.logout);

router.use(vendorAuthenticate);

router.post('/profile', upload.fields([
    { name: "BusinessLogo", maxCount: 1 },
    { name: "IdProof", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
]), vendorAuthController.Vendorprofile);




export default router;