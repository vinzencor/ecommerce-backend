class RefundService {
  constructor(refundRepository) {
    this.refundRepository = refundRepository;
  }

  async requestRefund(orderId, amount, reason) {
    return await this.refundRepository.createRefund({
      orderId,
      amount,
      reason,
      status: 'PENDING'
    });
  }

  async getOrderRefunds(orderId) {
    return await this.refundRepository.findByOrderId(orderId);
  }

  async getAllRefunds() {
    return await this.refundRepository.findAll();
  }

  async getRefundById(id) {
    return await this.refundRepository.findById(id);
  }

  async processRefund(id, status) {
    return await this.refundRepository.updateStatus(id, status);
  }
}

export default RefundService;
