class PayoutService {
  constructor(payoutRepository) {
    this.payoutRepository = payoutRepository;
  }

  async createPayoutRequest(vendorId, amount) {
    return await this.payoutRepository.createPayout({
      vendorId,
      amount,
      status: 'PENDING'
    });
  }

  async getVendorPayouts(vendorId) {
    return await this.payoutRepository.findByVendorId(vendorId);
  }

  async getAllPayouts() {
    return await this.payoutRepository.findAll();
  }

  async processPayout(id, status, transactionId) {
    return await this.payoutRepository.updateStatus(id, status, transactionId);
  }
}

export default PayoutService;
