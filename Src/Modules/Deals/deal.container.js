import DealRepository from "./deal.repository.js";
import DealService from "./deal.service.js";
import DealController from "./deal.controller.js";
import prisma from "../../Config/prismaClient.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const dealRepository = new DealRepository(prisma);
const dealService = new DealService(dealRepository, adminAuditLogContainer.adminAuditLogService);
const dealController = new DealController(dealService);

export default {
    dealService,
    dealController,
    dealRepository
};

