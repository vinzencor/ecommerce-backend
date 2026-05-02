import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class ReportsController {
  constructor(reportsService) {
    this.reportsService = reportsService;
  }

  async getSalesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportsService.getSalesDashboard(startDate, endDate);
      return sendSuccess(res, 200, "Sales report fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getOrdersReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportsService.getOrdersReport(startDate, endDate);
      return sendSuccess(res, 200, "Orders report fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getUsersReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportsService.getUsersReport(startDate, endDate);
      return sendSuccess(res, 200, "Users report fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getProductsReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportsService.getProductsReport(startDate, endDate);
      return sendSuccess(res, 200, "Products report fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getVendorsReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportsService.getVendorsReport(startDate, endDate);
      return sendSuccess(res, 200, "Vendors report fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getCouponsReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportsService.getCouponsReport(startDate, endDate);
      return sendSuccess(res, 200, "Coupons report fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default ReportsController;
