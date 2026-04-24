import prisma from "../../Config/prismaClient.js";
import VariantRepository from "./variant.repository.js";
import VariantService from "./variant.service.js";
import VariantController from "./variant.controller.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const variantRepository = new VariantRepository(prisma);
const variantService    = new VariantService(variantRepository, adminAuditLogContainer.adminAuditLogService);
const variantController = new VariantController(variantService);

export default {
    variantRepository,
    variantService,
    variantController,
};
