import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class CoinRewardController {
  constructor(coinRewardService) {
    this.coinRewardService = coinRewardService;
    this.createSettings = this.createSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.getSettings = this.getSettings.bind(this);
  }

  async createSettings(req, res) {
    try {
      const data = { ...req.body };
      const adminId = req.admin?.id;
      const settings = await this.coinRewardService.createSettings(data, adminId, req);
      return sendSuccess(res, 201, "Coin reward settings created successfully.", settings);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateSettings(req, res) {
    try {
      const data = { ...req.body };
      const adminId = req.admin?.id;
      const settings = await this.coinRewardService.updateSettings(data, adminId, req);
      return sendSuccess(res, 200, "Coin reward settings updated successfully.", settings);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getSettings(req, res) {
    try {
      const settings = await this.coinRewardService.getSettings();
      if (!settings) {
         return sendSuccess(res, 200, "No coin reward settings found.", {});
      }
      return sendSuccess(res, 200, "Coin reward settings fetched successfully.", settings);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default CoinRewardController;
