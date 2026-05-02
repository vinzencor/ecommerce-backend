class RewardService {
  constructor(rewardRepository) {
    this.rewardRepository = rewardRepository;
  }

  async addReward(userId, type, amount, description) {
    return await this.rewardRepository.createReward({
      userId,
      type,
      amount,
      description
    });
  }

  async getUserRewards(userId) {
    return await this.rewardRepository.findByUserId(userId);
  }

  async getAllRewards() {
    return await this.rewardRepository.findAll();
  }
}

export default RewardService;
