class WishlistRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findWishlistItem(userId, productId) {
    return this.db.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async add(userId, productId) {
    return this.db.$transaction(async (tx) => {
      const item = await tx.wishlist.create({
        data: { userId, productId },
      });
      
      await tx.product.update({
        where: { id: productId },
        data: { isFavourite: true },
      });
      
      return item;
    });
  }

  async remove(userId, productId) {
    return this.db.$transaction(async (tx) => {
      await tx.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      const count = await tx.wishlist.count({
        where: { productId },
      });

      if (count === 0) {
        await tx.product.update({
          where: { id: productId },
          data: { isFavourite: false },
        });
      }
    });
  }

  async getByUser(userId) {
    return this.db.wishlist.findMany({
      where: { userId },
      include: {
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
            variants: {
              where: { isPrimary: true },
              take: 1,
              include: { images: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getProductMinimal(productId) {
    return this.db.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true, taxPercentage: true, codAllowed: true, codExtraCharge: true },
    });
  }
}

export default WishlistRepository;
