class OfferService {
    constructor(offerRepository, adminAuditLogService) {
        this.offerRepository = offerRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    async create(data, adminId = null, req = null) {
        const payload = { ...data };

        if (req?.file) {
            payload.image = req.file.path || req.file.secure_url;
        }
        
        if (payload.startDate) payload.startDate = new Date(payload.startDate);
        if (payload.endDate) payload.endDate = new Date(payload.endDate);

        if (payload.productIds && Array.isArray(payload.productIds)) {
            payload.products = {
                connect: payload.productIds.map(id => ({ id }))
            };
            delete payload.productIds;
        }

        const offer = await this.offerRepository.create(payload);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "Offer",
                offer.id,
                null,
                offer,
                req
            );
        }

        return offer;
    }

    async getAll(filters = {}) {
        const { search, isActive, fromDate, toDate, page, limit } = filters;
        const normalizedFilters = { search, fromDate, toDate, page, limit };

        if (isActive !== undefined) {
            normalizedFilters.isActive = isActive === 'true' || isActive === true;
        }

        return this.offerRepository.getAll(normalizedFilters);
    }

    async getById(id) {
        return this.offerRepository.getById(id);
    }

    async update(id, data, adminId = null, req = null) {
        const existing = await this.offerRepository.getById(id);
        if (!existing) {
            const err = new Error("Offer not found.");
            err.statusCode = 404;
            throw err;
        }

        const payload = { ...data };

        if (req?.file) {
            payload.image = req.file.path || req.file.secure_url;
        }

        if (payload.startDate) payload.startDate = new Date(payload.startDate);
        if (payload.endDate) payload.endDate = new Date(payload.endDate);

        if (payload.productIds && Array.isArray(payload.productIds)) {
            payload.products = {
                set: payload.productIds.map(id => ({ id }))
            };
            delete payload.productIds;
        }

        const updated = await this.offerRepository.update(id, payload);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "Offer",
                id,
                existing,
                updated,
                req
            );
        }

        return updated;
    }

    async delete(id, adminId = null, req = null) {
        const offer = await this.offerRepository.getById(id);
        if (!offer) {
            const err = new Error("Offer not found.");
            err.statusCode = 404;
            throw err;
        }

        const now = new Date();
        const isLive = offer.isActive && offer.startDate <= now && offer.endDate >= now;

        if (isLive) {
            const err = new Error("Cannot delete a live offer. Please deactivate it first instead.");
            err.statusCode = 400;
            throw err;
        }

        const result = await this.offerRepository.delete(id);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "DELETE",
                "Offer",
                id,
                offer,
                null,
                req
            );
        }

        return result;
    }

    async toggleStatus(id, isActive, adminId = null, req = null) {
        const existing = await this.offerRepository.getById(id);
        if (!existing) {
            const err = new Error("Offer not found.");
            err.statusCode = 404;
            throw err;
        }

        const newStatus = isActive !== undefined ? (isActive === 'true' || isActive === true) : !existing.isActive;
        const updated = await this.offerRepository.toggleStatus(id, newStatus);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "Offer",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return updated;
    }
}

export default OfferService;
