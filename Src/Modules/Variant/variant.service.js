class VariantService {
    constructor(variantRepository, adminAuditLogService) {
        this.variantRepository = variantRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    async createName(data, adminId = null, req = null) {
        const { categoryId, ...variantData } = data;
        
        const existing = await this.variantRepository.findNameByName(variantData.name);

        if (existing) {
            if (categoryId) {
                await this.variantRepository.addCategoryLink(categoryId, existing.id);
                return existing;
            }
            const err = new Error(`Variant type "${variantData.name}" already exists.`);
            err.statusCode = 409;
            throw err;
        }
        
        const variantName = await this.variantRepository.createName(variantData);

        if (categoryId) {
            await this.variantRepository.addCategoryLink(categoryId, variantName.id);
        }

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "VariantName",
                variantName.id,
                null,
                variantName,
                req
            );
        }

        return variantName;
    }

    async findAllNames(search = "", page = 1, limit = 10, isActive = null, fromDate, toDate) {
        const safeInt = (val, fallback) => {
            if (val === "" || val === null || val === undefined || val === "null" || val === "undefined") return fallback;
            const parsed = parseInt(val);
            return isNaN(parsed) ? fallback : parsed;
        };

        const p = safeInt(page, 1);
        const l = safeInt(limit, 10);
        const skip = Math.max(0, (p - 1) * l);
        const take = Math.max(1, l);

        let activeStatus = null;
        if (isActive === "true" || isActive === true) activeStatus = true;
        if (isActive === "false" || isActive === false) activeStatus = false;

        const fDate = fromDate ? new Date(fromDate) : undefined;
        const tDate = toDate ? new Date(toDate) : undefined;

        return this.variantRepository.findAllNames(skip, take, search, activeStatus, fDate, tDate);
    }

    async findNameById(id) {
        const existing = await this.variantRepository.findNameById(id);
        if (!existing) {
            const err = new Error("Variant type not found.");
            err.statusCode = 404;
            throw err;
        }

        const categoryIds = (existing.categoryBy || []).map(cb => cb.categoryId);
        delete existing.categoryBy;
        
        return {
            ...existing,
            categoryIds
        };
    }

    async createValue(data, adminId = null, req = null) {
        const value = await this.variantRepository.createValue(data);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "VariantValue",
                value.id,
                null,
                value,
                req
            );
        }

        return value;
    }

    async updateValue(id, data, adminId = null, req = null) {
        const existing = await this.variantRepository.findValueById(id);
        if (!existing) {
            const err = new Error("Variant value not found.");
            err.statusCode = 404;
            throw err;
        }

        const updated = await this.variantRepository.updateValue(id, data);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "VariantValue",
                id,
                existing,
                updated,
                req
            );
        }

        return updated;
    }

    async toggleValueStatus(id, isActive, adminId = null, req = null) {
        const existing = await this.variantRepository.findValueById(id);
        if (!existing) {
            const err = new Error("Variant value not found.");
            err.statusCode = 404;
            throw err;
        }

        const newStatus = isActive !== undefined ? (isActive === 'true' || isActive === true) : !existing.isActive;
        const updated = await this.variantRepository.toggleValueStatus(id, newStatus);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "VariantValue",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return updated;
    }

    async updateName(id, data, adminId = null, req = null) {
        const existing = await this.variantRepository.findNameById(id);
        if (!existing) {
            const err = new Error("Variant type not found.");
            err.statusCode = 404;
            throw err;
        }
        const updated = await this.variantRepository.updateName(id, data);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "VariantName",
                id,
                existing,
                updated,
                req
            );
        }

        return updated;
    }

    async toggleNameStatus(id, isActive, adminId = null, req = null) {
        const existing = await this.variantRepository.findNameById(id);
        if (!existing) {
            const err = new Error("Variant type not found.");
            err.statusCode = 404;
            throw err;
        }
        
        const newStatus = isActive !== undefined ? (isActive === 'true' || isActive === true) : !existing.isActive;
        const updated = await this.variantRepository.toggleNameStatus(id, newStatus);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "VariantName",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return updated;
    }

    async linkToCategory(categoryId, variantNameIds) {
        return this.variantRepository.linkToCategory(categoryId, variantNameIds);
    }

    async getByCategory(categoryId) {
        return this.variantRepository.findVariantsByCategory(categoryId);
    }
}

export default VariantService;
