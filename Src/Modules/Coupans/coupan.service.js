class CoupanService {
    constructor(coupanRepository, adminAuditLogService) {
        this.coupanRepository = coupanRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    async create(data, adminId, req) {
        const coupan = await this.coupanRepository.create(data);
        
        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "Coupan",
                coupan.id,
                null,
                coupan,
                req
            );
        }
        
        return coupan;
    }

    async getAll(query) {
        return await this.coupanRepository.getAll(query);
    }

    async getById(id) {
        return await this.coupanRepository.getById(id);
    }

    async update(id, data, adminId, req) {
        const existing = await this.coupanRepository.getById(id);
        if (!existing) {
            const err = new Error("Coupan not found.");
            err.statusCode = 404;
            throw err;
        }

        const updated = await this.coupanRepository.update(id, data);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "Coupan",
                id,
                existing,
                updated,
                req
            );
        }

        return updated;
    }

    async toggleStatus(id, isActive, adminId, req) {
        const existing = await this.coupanRepository.getById(id);
        if (!existing) {
            const err = new Error("Coupan not found.");
            err.statusCode = 404;
            throw err;
        }

        const updated = await this.coupanRepository.toggleStatus(id, isActive);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "Coupan",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return updated;
    }

    async delete(id, adminId, req) {
        const existing = await this.coupanRepository.getById(id);
        if (!existing) {
            const err = new Error("Coupan not found.");
            err.statusCode = 404;
            throw err;
        }

        const result = await this.coupanRepository.delete(id);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "DELETE",
                "Coupan",
                id,
                existing,
                null,
                req
            );
        }

        return result;
    }
}

export default CoupanService;