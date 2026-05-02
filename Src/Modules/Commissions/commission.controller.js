import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class CommissionController {
  constructor(commissionService) {
    this.commissionService = commissionService;
  }

  async getMyCommissions(req, res) {
    try {
      const vendorId = req.user.id;
      const commissions = await this.commissionService.getVendorCommissions(vendorId);
      return sendSuccess(res, 200, "Commissions fetched successfully.", commissions);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllCommissions(req, res) {
    try {
      const commissions = await this.commissionService.getAllCommissions();
      return sendSuccess(res, 200, "All commissions fetched successfully.", commissions);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getVendorsWithCommission(req, res) {
    try {
      const { search, vendorFilter } = req.query;
      const vendors = await this.commissionService.getVendorsWithCommission(search, vendorFilter);
      return sendSuccess(res, 200, "Vendors fetched successfully.", vendors);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateVendorCommission(req, res) {
    try {
      const { vendorId } = req.params;
      const { percentage } = req.body;
      const vendor = await this.commissionService.updateVendorCommission(vendorId, percentage);
      return sendSuccess(res, 200, "Commission percentage updated successfully.", vendor);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async setVendorCommission(req, res) {
    try {
      const { vendorId, percentage } = req.body;
      const vendor = await this.commissionService.updateVendorCommission(vendorId, percentage);
      return sendSuccess(res, 200, "Commission percentage set successfully.", vendor);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAvailableVendors(req, res) {
    try {
      const vendors = await this.commissionService.getAvailableVendors();
      return sendSuccess(res, 200, "Available vendors fetched successfully.", vendors);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getCommissionStats(req, res) {
    try {
      const stats = await this.commissionService.getCommissionStats();
      return sendSuccess(res, 200, "Commission stats fetched successfully.", stats);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default CommissionController;
