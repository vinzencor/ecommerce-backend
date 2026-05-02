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
                product: {
                  include: {
                    vendor: {
                      select: {
                        name: true,
                        BusinessName: true,
                        GSTNumber: true,
                        BusinessAddress: true,
                      }
                    }
                  }
                },
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

  async findAll() {
    return await this.db.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdAdmin(orderId) {
    return await this.db.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
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
        refunds: true,
      },
    });
  }

  async updateStatus(orderId, status) {
    return await this.db.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}

export default OrderRepository;
