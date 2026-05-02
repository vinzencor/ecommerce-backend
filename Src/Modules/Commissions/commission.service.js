class CommissionService {
  constructor(commissionRepository) {
    this.commissionRepository = commissionRepository;
  }

  async calculateAndSaveCommission(orderId, vendorId, orderAmount, percentage) {
    const amount = (orderAmount * percentage) / 100;
    return await this.commissionRepository.createCommission({
      orderId,
      vendorId,
      amount,
      percentage
    });
  }

  async getVendorCommissions(vendorId) {
    return await this.commissionRepository.findByVendorId(vendorId);
  }

  async getAllCommissions() {
    return await this.commissionRepository.findAll();
  }

  async getVendorsWithCommission(search, vendorFilter) {
    return await this.commissionRepository.getVendorsWithCommission(search, vendorFilter);
  }

  async updateVendorCommission(vendorId, percentage) {
    return await this.commissionRepository.updateVendorCommission(vendorId, percentage);
  }

  async getAvailableVendors() {
    return await this.commissionRepository.getAvailableVendors();
  }

  async getCommissionStats() {
    return await this.commissionRepository.getCommissionStats();
  }
}

export default CommissionService;
