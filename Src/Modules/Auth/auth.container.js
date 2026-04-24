import prisma from "../../Config/prismaClient.js";
import { sendEmail } from "../../Config/emailService.js";
import { sendSMS } from "../../Utils/smsHelper.js";

import AuthRepository  from "./auth.repository.js";
import AuthService     from "./auth.service.js";
import AuthController  from "./auth.controller.js";

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, sendEmail, sendSMS);
const authController = new AuthController(authService);


export default authController;
