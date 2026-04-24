class BannerService {
  constructor(bannerRepository, adminAuditLogService) {
    this.bannerRepository = bannerRepository;
    this.adminAuditLogService = adminAuditLogService;
  }

  async create(data, adminId = null, req = null) {
    const payload = { ...data };

    if (payload.startDate) payload.startDate = new Date(payload.startDate);
    if (payload.endDate) payload.endDate = new Date(payload.endDate);
    if (payload.isActive !== undefined) {
      payload.isActive = payload.isActive === 'true' || payload.isActive === true;
    }

    if (payload.productIds && Array.isArray(payload.productIds)) {
      payload.products = {
        connect: payload.productIds.map((id) => ({ id })),
      };
      delete payload.productIds;
    }

    const banner = await this.bannerRepository.create(payload);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "CREATE",
            "Banner",
            banner.id,
            null,
            banner,
            req
        );
    }

    return banner;
  }

  async getAll(filters = {}) {
    const { search, isActive, fromDate, toDate } = filters;
    const normalizedFilters = {};

    if (search && typeof search === 'string' && search.trim() !== "") {
      normalizedFilters.search = search.trim();
    }

    if (fromDate && typeof fromDate === 'string' && fromDate.trim() !== "") {
      normalizedFilters.fromDate = fromDate.trim();
    }

    if (toDate && typeof toDate === 'string' && toDate.trim() !== "") {
      normalizedFilters.toDate = toDate.trim();
    }

    if (isActive !== undefined && isActive !== "" && isActive !== null) {
      normalizedFilters.isActive = isActive === 'true' || isActive === true;
    }

    return this.bannerRepository.getAll(normalizedFilters);
  }

  async getById(id) {
    const banner = await this.bannerRepository.getById(id);
    if (!banner) {
      const err = new Error('Banner not found.');
      err.statusCode = 404;
      throw err;
    }
    return banner;
  }

  async update(id, data, adminId = null, req = null) {
    const existing = await this.bannerRepository.getById(id);
    if (!existing) {
      const err = new Error('Banner not found.');
      err.statusCode = 404;
      throw err;
    }

    const payload = { ...data };

    if (payload.startDate) payload.startDate = new Date(payload.startDate);
    if (payload.endDate) payload.endDate = new Date(payload.endDate);
    if (payload.isActive !== undefined) {
      payload.isActive = payload.isActive === 'true' || payload.isActive === true;
    }

    if (payload.productIds && Array.isArray(payload.productIds)) {
      payload.products = {
        set: payload.productIds.map((id) => ({ id })),
      };
      delete payload.productIds;
    }

    const updated = await this.bannerRepository.update(id, payload);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "UPDATE",
            "Banner",
            id,
            existing,
            updated,
            req
        );
    }

    return updated;
  }

  async delete(id, adminId = null, req = null) {
    const existing = await this.bannerRepository.getById(id);
    if (!existing) {
      const err = new Error('Banner not found.');
      err.statusCode = 404;
      throw err;
    }
    
    const result = await this.bannerRepository.delete(id);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "DELETE",
            "Banner",
            id,
            existing,
            null,
            req
        );
    }

    return result;
  }

  async toggleStatus(id, isActive, adminId = null, req = null) {
    const existing = await this.bannerRepository.getById(id);
    if (!existing) {
      const err = new Error('Banner not found.');
      err.statusCode = 404;
      throw err;
    }

    const newStatus =
      isActive !== undefined
        ? isActive === 'true' || isActive === true
        : !existing.isActive;

    const updated = await this.bannerRepository.toggleStatus(id, newStatus);

    if (adminId && this.adminAuditLogService) {
        await this.adminAuditLogService.log(
            adminId,
            "TOGGLE_STATUS",
            "Banner",
            id,
            { isActive: existing.isActive },
            { isActive: updated.isActive },
            req
        );
    }

    return updated;
  }
}

export default BannerService;
