class BrandService {
  constructor(brandRepository, adminAuditLogService) {
    this.brandRepository = brandRepository;
    this.adminAuditLogService = adminAuditLogService;
  }

  async create(data, adminId = null, req = null) {
    const { brandName, categoryId, image, isActive } = data;

    const existing = await this.brandRepository.findByNameAndCategory(brandName, categoryId);
    if (existing) {
      const err = new Error("A brand with this name already exists in the selected category.");
      err.statusCode = 409;
      throw err;
    }

    const payload = {
      brandName,
      categoryId,
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && {
        isActive: isActive === "true" || isActive === true,
      }),
    };

    const brand = await this.brandRepository.create(payload);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "CREATE",
            "Brand",
            brand.id,
            null,
            brand,
            req
        );
    }

    return brand;
  }

  async getAll(filters = {}) {
    // ... no changes to filters logic ...
    const { search, isActive, fromDate, toDate, categoryId, page, limit } = filters;

    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (currentPage - 1) * pageSize;

    const normalizedFilters = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      normalizedFilters.search = search.trim();
    }

    if (isActive !== undefined && isActive !== "" && isActive !== null) {
      normalizedFilters.isActive = isActive === "true" || isActive === true;
    }

    if (fromDate && typeof fromDate === "string" && fromDate.trim() !== "") {
      normalizedFilters.fromDate = fromDate.trim();
    }

    if (toDate && typeof toDate === "string" && toDate.trim() !== "") {
      normalizedFilters.toDate = toDate.trim();
    }

    if (categoryId && typeof categoryId === "string" && categoryId.trim() !== "") {
      normalizedFilters.categoryId = categoryId.trim();
    }

    const { brands, total } = await this.brandRepository.findAll(skip, pageSize, normalizedFilters);

    return {
      brands,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getByCategoryId(categoryId) {
    if (!categoryId) {
      const err = new Error("Category ID is required.");
      err.statusCode = 400;
      throw err;
    }
    return this.brandRepository.findByCategoryId(categoryId);
  }

  async getById(id) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      const err = new Error("Brand not found.");
      err.statusCode = 404;
      throw err;
    }
    return brand;
  }

  async update(id, data, adminId = null, req = null) {
    const existing = await this.brandRepository.findById(id);
    if (!existing) {
      const err = new Error("Brand not found.");
      err.statusCode = 404;
      throw err;
    }

    const payload = {};
    if (data.brandName !== undefined) payload.brandName = data.brandName;
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
    if (data.image !== undefined) payload.image = data.image;
    if (data.isActive !== undefined) {
      payload.isActive = data.isActive === "true" || data.isActive === true;
    }

    const updated = await this.brandRepository.update(id, payload);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "UPDATE",
            "Brand",
            id,
            existing,
            updated,
            req
        );
    }

    return updated;
  }

  async delete(id, adminId = null, req = null) {
    const existing = await this.brandRepository.findById(id);
    if (!existing) {
      const err = new Error("Brand not found.");
      err.statusCode = 404;
      throw err;
    }

    const result = await this.brandRepository.delete(id);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "DELETE",
            "Brand",
            id,
            existing,
            null,
            req
        );
    }

    return result;
  }

  async toggleStatus(id, isActive, adminId = null, req = null) {
    const existing = await this.brandRepository.findById(id);
    if (!existing) {
      const err = new Error("Brand not found.");
      err.statusCode = 404;
      throw err;
    }

    const newStatus =
      isActive !== undefined
        ? isActive === "true" || isActive === true
        : !existing.isActive;

    const updated = await this.brandRepository.toggleStatus(id, newStatus);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "TOGGLE_STATUS",
            "Brand",
            id,
            { isActive: existing.isActive },
            { isActive: updated.isActive },
            req
        );
    }

    return updated;
  }
}

export default BrandService;
