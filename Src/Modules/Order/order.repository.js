class OrderRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createOrder(data, items) {
    return await this.db.order.create({
      data: {
        ...data,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId) {
    return await this.db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(orderId, userId) {
    return await this.db.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                product: true,
              },
            },
          },
        },
        address: true,
      },
    });
  }

  async getLatestOrderNumber() {
    return await this.db.order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });
  }
}

export default OrderRepository;
