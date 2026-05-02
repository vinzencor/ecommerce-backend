import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class RewardController {
  constructor(rewardService) {
    this.rewardService = rewardService;
  }

  async getMyRewards(req, res) {
    try {
      const userId = req.user.id;
      const rewards = await this.rewardService.getUserRewards(userId);
      return sendSuccess(res, 200, "Rewards fetched successfully.", rewards);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllRewards(req, res) {
    try {
      const rewards = await this.rewardService.getAllRewards();
      return sendSuccess(res, 200, "All user rewards fetched successfully.", rewards);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async giveReward(req, res) {
    try {
      const { userId, type, amount, description } = req.body;
      const reward = await this.rewardService.addReward(userId, type, amount, description);
      return sendSuccess(res, 201, "Reward given successfully.", reward);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default RewardController;
