import prisma from "../../Config/prismaClient.js";

class CoinRewardRepository {
  constructor(prismaInstance) {
    this.db = prismaInstance || prisma;
  }

  async createSettings(data) {
    const existing = await this.db.coinRewardSetting.findFirst();
    if (existing) {
      throw new Error("Settings already exist. Please update them instead.");
    }
    return await this.db.coinRewardSetting.create({
      data,
    });
  }

  async updateSettings(data) {
    const existing = await this.db.coinRewardSetting.findFirst();
    if (!existing) {
      throw new Error("Settings not found. Please create them first.");
    }
    return await this.db.coinRewardSetting.update({
      where: { id: existing.id },
      data,
    });
  }

  async getSettings() {
    return await this.db.coinRewardSetting.findFirst();
  }
}

export default CoinRewardRepository;
