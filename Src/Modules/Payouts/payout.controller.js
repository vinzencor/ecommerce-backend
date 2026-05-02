import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class PayoutController {
  constructor(payoutService) {
    this.payoutService = payoutService;
  }

  async requestPayout(req, res) {
    try {
      const vendorId = req.user.id;
      const { amount } = req.body;
      const payout = await this.payoutService.createPayoutRequest(vendorId, amount);
      return sendSuccess(res, 201, "Payout request submitted successfully.", payout);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getMyPayouts(req, res) {
    try {
      const vendorId = req.user.id;
      const payouts = await this.payoutService.getVendorPayouts(vendorId);
      return sendSuccess(res, 200, "Payouts fetched successfully.", payouts);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllPayouts(req, res) {
    try {
      const payouts = await this.payoutService.getAllPayouts();
      return sendSuccess(res, 200, "All payouts fetched successfully.", payouts);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async processPayout(req, res) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;
      const payout = await this.payoutService.processPayout(id, status, transactionId);
      return sendSuccess(res, 200, "Payout processed successfully.", payout);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default PayoutController;
