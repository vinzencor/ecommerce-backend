class CartRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findCartItem(userId, productVariantId) {
    return this.db.cart.findUnique({
      where: {
        userId_productVariantId: {
          userId,
          productVariantId,
        },
      },
    });
  }

  async addOrUpdate(userId, productVariantId, quantity) {
    return this.db.cart.upsert({
      where: {
        userId_productVariantId: {
          userId,
          productVariantId,
        },
      },
      update: {
        quantity: quantity,
      },
      create: {
        userId,
        productVariantId,
        quantity,
      },
    });
  }

  async remove(userId, productVariantId) {
    return this.db.cart.delete({
      where: {
        userId_productVariantId: {
          userId,
          productVariantId,
        },
      },
    });
  }

  async clearUserCart(userId) {
    return this.db.cart.deleteMany({
      where: { userId },
    });
  }

  async getByUser(userId) {
    return this.db.cart.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            selections: {
              include: {
                variantName: { select: { name: true } },
                variantValue: { select: { value: true } }
              }
            },
            product: {
              include: {
                category: { select: { name: true } },
                brand: { select: { brandName: true } },
                offers: {
                  where: {
                    isActive: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserCoins(userId) {
    const user = await this.db.users.findUnique({
        where: { id: userId },
        select: { coins: true }
    });
    return user?.coins || 0;
  }

  async getVariantStockAndPrice(productVariantId) {
    return this.db.productVariant.findUnique({
      where: { id: productVariantId },
      select: {
        id: true,
        stock: true,
        price: true,
        discount: true,
        discountedPrice: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        product: { select: { id: true, productName: true, isActive: true, taxPercentage: true } },
      },
    });
  }
}

export default CartRepository;
