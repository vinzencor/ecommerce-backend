import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class BannerController {
  constructor(bannerService) {
    this.bannerService = bannerService;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
  }

  async create(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.image = req.file.path;
      }

      const adminId = req.admin?.id;
      const banner = await this.bannerService.create(data, adminId, req);
      return sendSuccess(res, 201, "Banner created successfully.", banner);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const { search, isActive, fromDate, toDate } = req.query;
      const banners = await this.bannerService.getAll({ search, isActive, fromDate, toDate });
      return sendSuccess(res, 200, "Banners fetched successfully.", banners);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getById(req, res) {
    try {
      const banner = await this.bannerService.getById(req.params.id);
      return sendSuccess(res, 200, "Banner fetched successfully.", banner);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.image = req.file.path;
      }

      const adminId = req.admin?.id;
      const banner = await this.bannerService.update(req.params.id, data, adminId, req);
      return sendSuccess(res, 200, "Banner updated successfully.", banner);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async delete(req, res) {
    try {
      const adminId = req.admin?.id;
      const banner = await this.bannerService.delete(req.params.id, adminId, req);
      return sendSuccess(res, 200, "Banner deleted successfully.", banner);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async toggleStatus(req, res) {
    try {
      const adminId = req.admin?.id;
      const banner = await this.bannerService.toggleStatus(req.params.id, req.body.isActive, adminId, req);
      return sendSuccess(res, 200, "Banner status updated successfully.", banner);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default BannerController;
