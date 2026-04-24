class CoinRewardService {
  constructor(coinRewardRepository, adminAuditLogService) {
    this.coinRewardRepository = coinRewardRepository;
    this.adminAuditLogService = adminAuditLogService;
  }

  async createSettings(data, adminId, req) {
    const settings = await this.coinRewardRepository.createSettings(data);
    
    if (this.adminAuditLogService) {
      await this.adminAuditLogService.log(
        adminId,
        "CREATE_COIN_SETTINGS",
        "CoinRewardSetting",
        settings.id,
        null,
        data,
        req
      );
    }

    return settings;
  }

  async updateSettings(data, adminId, req) {
    const settings = await this.coinRewardRepository.updateSettings(data);
    
    if (this.adminAuditLogService) {
      await this.adminAuditLogService.log(
        adminId,
        "UPDATE_COIN_SETTINGS",
        "CoinRewardSetting",
        settings.id,
        null,
        data,
        req
      );
    }

    return settings;
  }

  async getSettings() {
    return await this.coinRewardRepository.getSettings();
  }
}

export default CoinRewardService;
