class NotificationService {
    constructor(notificationRepository, adminAuditLogService) {
        this.notificationRepository = notificationRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    _parsePayload(data) {
        if (!data) return {};
        const payload = { ...data };
        if (typeof payload.selectedUsers === 'string' && payload.selectedUsers.trim() !== '') {
            try {
                payload.selectedUsers = JSON.parse(payload.selectedUsers.trim());
            } catch (e) {
                if (payload.selectedUsers.includes(',')) {
                    payload.selectedUsers = payload.selectedUsers.split(',').map(s => s.trim());
                } else {
                    payload.selectedUsers = [payload.selectedUsers];
                }
            }
        }
        return payload;
    }

    async createNotification(data, adminId = null, req = null) {
        let payload = this._parsePayload(data);
        let { title, message, image, sentAt, audience, selectedUsers } = payload;
        if (Array.isArray(selectedUsers) && selectedUsers.length > 0) {
            audience = 'selected';
        } else if (!audience) {
            audience = 'all';
        }

        const sentAtDate = sentAt ? new Date(sentAt) : new Date();

        const notification = await this.notificationRepository.create({
            title,
            message,
            image,
            sentAt: sentAtDate,
            audience,
            selectedUsers: Array.isArray(selectedUsers) ? selectedUsers : []
        });

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "Notification",
                notification.id,
                null,
                notification,
                req
            );
        }

        if (sentAtDate <= new Date()) {
            await this.deliverNotification(notification);
        }

        return notification;
    }

    async deliverNotification(notification) {
        let targetUserIds = [];
        const { id: notificationId, audience,selectedUsers } = notification;

        if (audience === 'all') {
            targetUserIds = await this.notificationRepository.getAllUserIds();
        }
        if (audience === 'selected') {
            targetUserIds = selectedUsers;
        }

        const uniqueUserIds = [...new Set(targetUserIds.filter(Boolean))];
        if (uniqueUserIds.length > 0) {
            const BATCH_SIZE = 1000;
            for (let index = 0; index < uniqueUserIds.length; index += BATCH_SIZE) {
                const batch = uniqueUserIds.slice(index, index + BATCH_SIZE);
                const userNotificationData = batch.map(userId => ({
                    userId,
                    notificationId
                }));
                await this.notificationRepository.createUserNotifications(userNotificationData);
            }
        }
    }

    async processScheduledNotifications() {
        const now = new Date();
        const pending = await this.notificationRepository.findScheduled(now);

        const CONCURRENCY = 10;
        for (let index = 0; index < pending.length; index += CONCURRENCY) {
            const batch = pending.slice(index, index + CONCURRENCY);
            await Promise.all(batch.map((notification) => this.deliverNotification(notification)));
        }

        return pending.length;
    }

    async getAdminNotifications(query) {
        const { page, limit, search, fromDate, toDate } = query;
        const result = await this.notificationRepository.findAll({ page, limit, search, fromDate, toDate });
        return result;
    }

    async getNotificationDetails(id) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            const err = new Error("Notification not found.");
            err.statusCode = 404;
            throw err;
        }
        return notification;
    }




    async deleteNotification(id, adminId = null, req = null) {
        const existing = await this.notificationRepository.findById(id);
        if (!existing) {
            const err = new Error("Notification not found.");
            err.statusCode = 404;
            throw err;
        }

        const result = await this.notificationRepository.delete(id);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "DELETE",
                "Notification",
                id,
                existing,
                null,
                req
            );
        }

        return result;
    }
}

export default NotificationService;
