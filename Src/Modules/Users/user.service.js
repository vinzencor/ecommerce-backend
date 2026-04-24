class UserService {
    constructor(userRepository, adminAuditLogService) {
        this.userRepository = userRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    async getAll(query) {
        return await this.userRepository.getAll(query);
    }

    async getStats() {
        return await this.userRepository.getStats();
    }

 

    async toggleStatus(id, isActive, adminId, req) {
        const existing = await this.userRepository.findById(id);
        if (!existing) {
            const error = new Error("User not found.");
            error.statusCode = 404;
            throw error;
        }

        const updated = await this.userRepository.updateStatus(id, isActive);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "User",
                id,
                { is_active: existing.is_active },
                { is_active: updated.is_active },
                req
            );
        }

        return updated;
    }
}

export default UserService;
