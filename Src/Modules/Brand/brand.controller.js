import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class BrandController {
  constructor(brandService) {
    this.brandService = brandService;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getByCategoryId = this.getByCategoryId.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
  }

  async create(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) data.image = req.file.path;
      const adminId = req.admin?.id;
      const brand = await this.brandService.create(data, adminId, req);
      return sendSuccess(res, 201, "Brand created successfully.", brand);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const { search, isActive, fromDate, toDate, categoryId, page, limit } = req.query;
      const result = await this.brandService.getAll({ search, isActive, fromDate, toDate, categoryId, page, limit });
      return sendSuccess(res, 200, "Brands fetched successfully.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
  
  async getByCategoryId(req, res) {
    try {
      const brands = await this.brandService.getByCategoryId(req.params.categoryId);
      return sendSuccess(res, 200, "Brands fetched successfully for category.", brands);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getById(req, res) {
    try {
      const brand = await this.brandService.getById(req.params.id);
      return sendSuccess(res, 200, "Brand fetched successfully.", brand);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) data.image = req.file.path;
      const adminId = req.admin?.id;
      const brand = await this.brandService.update(req.params.id, data, adminId, req);
      return sendSuccess(res, 200, "Brand updated successfully.", brand);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async delete(req, res) {
    try {
      const adminId = req.admin?.id;
      await this.brandService.delete(req.params.id, adminId, req);
      return sendSuccess(res, 200, "Brand deleted successfully.", null);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async toggleStatus(req, res) {
    try {
      const adminId = req.admin?.id;
      const brand = await this.brandService.toggleStatus(req.params.id, req.body.isActive, adminId, req);
      return sendSuccess(res, 200, "Brand status updated successfully.", brand);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default BrandController;
