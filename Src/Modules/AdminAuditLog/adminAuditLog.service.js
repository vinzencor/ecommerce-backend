class AdminAuditLogService {
    constructor(adminAuditLogRepository) {
        this.adminAuditLogRepository = adminAuditLogRepository;
    }

    async log(adminId, action, entity, entityId, oldValue = null, newValue = null, req = null) {
        try {
            const logData = {
                adminId,
                action,
                entity,
                entityId,
                oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : null,
                newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : null,
                ipAddress: req?.ip || req?.headers['x-forwarded-for'] || null,
                userAgent: req?.headers['user-agent'] || null
            };

            return await this.adminAuditLogRepository.create(logData);
        } catch (error) {
            console.error("Failed to create audit log:", error);
            return null;
        }
    }

    async getAll(page = 1, limit = 20, adminId = null, action = null, entity = null, search = null, fromDate = null, toDate = null) {
        const skip = (page - 1) * limit;
        const take = parseInt(limit);
        return this.adminAuditLogRepository.findAll(skip, take, adminId, action, entity, search, fromDate, toDate);
    }

    async getById(id) {
        return this.adminAuditLogRepository.findById(id);
    }
}

export default AdminAuditLogService;
