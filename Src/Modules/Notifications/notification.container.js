import NotificationController from "./notification.controller.js";
import NotificationRepository from "./notification.repository.js";
import NotificationService from "./notification.service.js";
import adminAuditLogContainer from "../AdminAuditLog/adminAuditLog.container.js";

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, adminAuditLogContainer.adminAuditLogService);
const notificationController = new NotificationController(notificationService);

export default {
    notificationController,
    notificationService,
    notificationRepository
};
