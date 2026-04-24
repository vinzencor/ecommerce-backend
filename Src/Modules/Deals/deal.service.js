class DealService {
    constructor(dealRepository, adminAuditLogService) {
        this.dealRepository = dealRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    async create(data, adminId = null, req = null) {
        const payload = { ...data };
        if (payload.date) {
            const date = new Date(payload.date);
            date.setHours(0, 0, 0, 0); 
            payload.date = date;
        }

        const deal = await this.dealRepository.create(payload);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "DealOfTheDay",
                deal.id,
                null,
                deal,
                req
            );
        }

        return deal;
    }

    async findAll(query = {}) {
        const safeInt = (val, fallback) => {
            if (val === "" || val === null || val === undefined || val === "null" || val === "undefined") return fallback;
            const parsed = parseInt(val);
            return isNaN(parsed) ? fallback : parsed;
        };

        const page = safeInt(query.page, 1);
        const limit = safeInt(query.limit, 10);
        const { search, fromDate, toDate, isActive } = query;

        const filters = {
            page,
            limit,
            search,
            fromDate,
            toDate
        };

        if (isActive !== undefined && isActive !== null && isActive !== "") {
            filters.isActive = isActive === "true" || isActive === true;
        }

        return this.dealRepository.findAll(filters);
    }

    async findById(id) {
        return this.dealRepository.findById(id);
    }

    async update(id, data, adminId = null, req = null) {
        const existing = await this.dealRepository.findById(id);
        if (!existing) {
            const err = new Error("Deal not found.");
            err.statusCode = 404;
            throw err;
        }

        const payload = { ...data };
        if (payload.date) {
            const date = new Date(payload.date);
            date.setHours(0, 0, 0, 0);
            payload.date = date;
        }

        const updated = await this.dealRepository.update(id, payload);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "DealOfTheDay",
                id,
                existing,
                updated,
                req
            );
        }

        return updated;
    }

    async delete(id, adminId = null, req = null) {
        const existing = await this.dealRepository.findById(id);
        if (!existing) {
            const err = new Error("Deal not found.");
            err.statusCode = 404;
            throw err;
        }

        const result = await this.dealRepository.delete(id);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "DELETE",
                "DealOfTheDay",
                id,
                existing,
                null,
                req
            );
        }

        return result;
    }

    async getTodayDeals() {
        return this.dealRepository.findTodayDeals();
    }

    async toggleStatus(id, isActive, adminId = null, req = null) {
        const existing = await this.dealRepository.findById(id);
        if (!existing) {
            const err = new Error("Deal not found.");
            err.statusCode = 404;
            throw err;
        }

        const newStatus = isActive !== undefined ? (isActive === 'true' || isActive === true) : !existing.isActive;
        const updated = await this.dealRepository.toggleStatus(id, newStatus);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "DealOfTheDay",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return updated;
    }
}

export default DealService;
