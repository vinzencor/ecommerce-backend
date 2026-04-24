import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }

    createNotification = async (req, res, next) => {
        try {
            const data = {
                ...req.body,
                image: req.file ? req.file.path : null
            };
            const adminId = req.admin?.id;
            const result = await this.notificationService.createNotification(data, adminId, req);
            return sendSuccess(res, 201, "Notification created and sent successfully.", result);
        } catch (error) {
            next(error);
        }
    };

    getAdminNotifications = async (req, res, next) => {
        try {
            const { page = 1, limit = 10,search, fromDate, toDate } = req.query;
            const result = await this.notificationService.getAdminNotifications({ page, limit,search, fromDate, toDate });
            return sendSuccess(res, 200, "Notifications fetched successfully.", result);
        } catch (error) {
            next(error);
        }
    };

    getNotificationDetails = async (req, res, next) => {
        try {
            const result = await this.notificationService.getNotificationDetails(req.params.id);
            return sendSuccess(res, 200, "Notification details fetched successfully.", result);
        } catch (error) {
            next(error);
        }
    };



    deleteNotification = async (req, res, next) => {
        try {
            const adminId = req.admin?.id;
            await this.notificationService.deleteNotification(req.params.id, adminId, req);
            return sendSuccess(res, 200, "Notification deleted successfully.");
        } catch (error) {
            next(error);
        }
    };
}

export default NotificationController;
