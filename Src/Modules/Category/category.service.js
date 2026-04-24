class CategoryService {
    constructor(categoryRepository, adminAuditLogService) {
        this.categoryRepository = categoryRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    async create(payload, adminId = null, req = null) {
        const { name, description, image, parentId, level } = payload;

        if (!name || !name.trim()) {
            const err = new Error("Category name is required.");
            err.statusCode = 400;
            throw err;
        }

        if (!level) {
            const err = new Error("Category level is required.");
            err.statusCode = 400;
            throw err;
        }

        const validLevels = ["TITLE", "MAIN", "SUB"];
        if (!validLevels.includes(level)) {
            const err = new Error(`Invalid category level. Must be one of: ${validLevels.join(", ")}`);
            err.statusCode = 400;
            throw err;
        }

        const existing = await this.categoryRepository.findByName(name.trim());
        if (existing) {
            const err = new Error(`A category named "${name}" already exists.`);
            err.statusCode = 409;
            throw err;
        }

        

        if (parentId) {
            const parent = await this.categoryRepository.findById(parentId);
            if (!parent) {
                const err = new Error("Parent category not found.");
                err.statusCode = 404;
                throw err;
            }
        }

        const category = await this.categoryRepository.create({
            name: name.trim(),
            description: description?.trim() || null,
            image: image || null,
            parentId: parentId || null,
            level: level,
        });

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "Category",
                category.id,
                null,
                category,
                req
            );
        }

        return category;
    }


    async getAll(level,fromDate,toDate) {
        if (level) {
            const validLevels = ["TITLE", "MAIN", "SUB"];
            if (!validLevels.includes(level.toUpperCase())) {
                const err = new Error(`Invalid category level. Must be one of: ${validLevels.join(", ")}`);
                err.statusCode = 400;
                throw err;
            }
            return this.categoryRepository.findAllWithoutPagination(level.toUpperCase(), fromDate || null, toDate || null);
        }
        return this.categoryRepository.findAllWithoutPagination(null, fromDate || null, toDate || null);
    }

    async getByLevel(level, page = 1, limit = 10, search = "", isActive,fromDate,toDate) {
        const validLevels = ["TITLE", "MAIN", "SUB"];
        if (!validLevels.includes(level)) {
            const err = new Error(`Invalid category level. Must be one of: ${validLevels.join(", ")}`);
            err.statusCode = 400;
            throw err;
        }

        const skip = (page - 1) * limit;
        const take = parseInt(limit);
        const result = await this.categoryRepository.findByLevel(level, skip, take, search, isActive,fromDate || null,toDate || null);

        return result;
    }

    async getById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            const err = new Error("Category not found.");
            err.statusCode = 404;
            throw err;
        }
        return category;
    }

    async update(id, payload, adminId = null, req = null) {
        const { name, description, image, parentId, isActive, level } = payload;

        const existing = await this.categoryRepository.findById(id);
        if (!existing) {
            const err = new Error("Category not found.");
            err.statusCode = 404;
            throw err;
        }

        if (name && name.trim() !== existing.name) {
            const duplicate = await this.categoryRepository.findByName(name.trim());
            if (duplicate) {
                const err = new Error(`A category named "${name}" already exists.`);
                err.statusCode = 409;
                throw err;
            }
        }

        if (parentId && parentId === id) {
            const err = new Error("A category cannot be its own parent.");
            err.statusCode = 400;
            throw err;
        }

        if (level) {
            const validLevels = ["TITLE", "MAIN", "SUB"];
            if (!validLevels.includes(level)) {
                const err = new Error(`Invalid category level. Must be one of: ${validLevels.join(", ")}`);
                err.statusCode = 400;
                throw err;
            }
        }

        const data = {};
        if (name        !== undefined) data.name        = name.trim();
        if (description !== undefined) data.description = description?.trim() || null;
        if (image       !== undefined) data.image       = image || null;
        if (parentId    !== undefined) data.parentId    = parentId || null;
        if (isActive    !== undefined) data.isActive    = isActive;
        if (level       !== undefined) data.level       = level;

        const updated = await this.categoryRepository.update(id, data);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "Category",
                id,
                existing,
                updated,
                req
            );
        }

        return updated;
    }

    async toggleStatus(id, adminId = null, req = null) {
        const existing = await this.categoryRepository.findById(id);
        if (!existing) {
            const err = new Error("Category not found.");
            err.statusCode = 404;
            throw err;
        }

        const newStatus = !existing.isActive;
        const updated   = await this.categoryRepository.toggleStatus(id, newStatus);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "Category",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return {
            ...updated,
            message: newStatus ? "Category activated." : "Category deactivated.",
        };
    }


}

export default CategoryService;