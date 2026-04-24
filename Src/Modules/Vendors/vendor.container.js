import prisma from "../../Config/prismaClient.js";
import { sendEmail } from "../../Config/emailService.js";
import VendorRepository from "./vendor.repository.js";
import VendorService from "./vendor.service.js";
import VendorController from "./vendor.controller.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const vendorRepository = new VendorRepository(prisma);
const vendorService = new VendorService(vendorRepository, sendEmail, adminAuditLogContainer.adminAuditLogService);
const vendorController = new VendorController(vendorService);

export default {
    vendorRepository,
    vendorService,
    vendorController,
};
