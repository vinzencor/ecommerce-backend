class PayoutRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createPayout(data) {
    return await this.db.payout.create({
      data,
      include: { vendor: { select: { name: true, email: true } } }
    });
  }

  async findByVendorId(vendorId) {
    return await this.db.payout.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll() {
    return await this.db.payout.findMany({
      include: { vendor: { select: { name: true, BusinessName: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id, status, transactionId) {
    return await this.db.payout.update({
      where: { id },
      data: { status, transactionId }
    });
  }
}

export default PayoutRepository;
