class RefundRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createRefund(data) {
    return await this.db.refund.create({
      data,
      include: { order: { select: { orderNumber: true, totalAmount: true } } }
    });
  }

  async findByOrderId(orderId) {
    return await this.db.refund.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll() {
    return await this.db.refund.findMany({
      include: { order: { select: { orderNumber: true, totalAmount: true, userId: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return await this.db.refund.findUnique({
      where: { id },
      include: { order: { include: { user: true, items: { include: { variant: { include: { product: true } } } } } } }
    });
  }

  async updateStatus(id, status) {
    return await this.db.refund.update({
      where: { id },
      data: { status }
    });
  }
}

export default RefundRepository;
