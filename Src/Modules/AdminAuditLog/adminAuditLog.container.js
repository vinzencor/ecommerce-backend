import prisma from "../../Config/prismaClient.js";
import AdminAuditLogRepository from "./adminAuditLog.repository.js";
import AdminAuditLogService from "./adminAuditLog.service.js";
import AdminAuditLogController from "./adminAuditLog.controller.js";

const adminAuditLogRepository = new AdminAuditLogRepository(prisma);
const adminAuditLogService = new AdminAuditLogService(adminAuditLogRepository);
const adminAuditLogController = new AdminAuditLogController(adminAuditLogService);

export default {
    adminAuditLogRepository,
    adminAuditLogService,
    adminAuditLogController
};
