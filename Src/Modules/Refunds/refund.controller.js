import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class RefundController {
  constructor(refundService) {
    this.refundService = refundService;
  }

  async requestRefund(req, res) {
    try {
      const { orderId, amount, reason } = req.body;
      const refund = await this.refundService.requestRefund(orderId, amount, reason);
      return sendSuccess(res, 201, "Refund request submitted successfully.", refund);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllRefunds(req, res) {
    try {
      const refunds = await this.refundService.getAllRefunds();
      return sendSuccess(res, 200, "All refund requests fetched successfully.", refunds);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getRefundById(req, res) {
    try {
      const { id } = req.params;
      const refund = await this.refundService.getRefundById(id);
      if (!refund) {
        return sendError(res, 404, "Refund request not found.");
      }
      return sendSuccess(res, 200, "Refund request fetched successfully.", refund);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const refund = await this.refundService.processRefund(id, status);
      return sendSuccess(res, 200, "Refund status updated successfully.", refund);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default RefundController;
