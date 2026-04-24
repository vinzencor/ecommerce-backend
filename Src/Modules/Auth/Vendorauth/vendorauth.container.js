import prisma from "../../../Config/prismaClient.js";
import { sendEmail } from "../../../Config/emailService.js";

import VendorAuthRepository from "./vendorauth.repository.js";
import VendorAuthService from "./vendorauth.service.js";
import VendorAuthController from "./vendorauth.controller.js";

const vendorAuthRepository = new VendorAuthRepository(prisma);

const vendorAuthService = new VendorAuthService(vendorAuthRepository, sendEmail);

const vendorAuthController = new VendorAuthController(vendorAuthService);


export default {
    vendorAuthRepository,
    vendorAuthService,
    vendorAuthController,
};