import express from "express";
import authController from "./auth.container.js";
import validate from "../../Middlewares/validate.js";
import { registerSchema, loginSchema, verifyEmailSchema, resendOTPSchema,isDefaultSchema, updateProfileSchema } from "../../Utils/authValidation.js";
import { resendOtpLimiter, registerLimiter, loginLimiter } from "../../Middlewares/rateLimiter.js";
import authenticate from "../../Middlewares/authenticate.js";
import upload from "../../Middlewares/upload.js";
const router = express.Router();

// public routes


router.post("/register",registerLimiter, validate(registerSchema), authController.register);

router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);

router.post("/resend-otp", resendOtpLimiter, validate(resendOTPSchema), authController.resendOTP);

router.post("/login", loginLimiter, validate(loginSchema), authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refreshToken);

router.use(authenticate);
router.get('/profile',authController.getProfile);
router.patch('/profile', upload.single('image'), validate(updateProfileSchema), authController.updateProfile);

// Address Management
router.get('/address', authController.getAddresses);
router.post('/address', authController.addNewAddress);
router.patch('/address/:id', authController.updateAddress);
router.delete('/address/:id', authController.deleteAddress);
router.patch('/address/default/:id', validate(isDefaultSchema), authController.makeAddressDefault);


export default router;
