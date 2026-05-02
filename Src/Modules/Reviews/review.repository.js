class ReviewRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createReview(data) {
    return await this.db.review.create({
      data,
      include: {
        user: { select: { name: true, image: true } }
      }
    });
  }

  async findByProductId(productId) {
    return await this.db.review.findMany({
      where: { productId, isActive: true },
      include: {
        user: { select: { name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByUserAndProduct(userId, productId) {
    return await this.db.review.findFirst({
      where: { userId, productId }
    });
  }

  async findAll() {
    return await this.db.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { productName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(reviewId, isActive) {
    return await this.db.review.update({
      where: { id: reviewId },
      data: { isActive }
    });
  }

  async deleteReview(reviewId) {
    return await this.db.review.delete({
      where: { id: reviewId }
    });
  }

  async checkPurchase(userId, productId) {
    // Check if user has a DELIVERED order with this product
    const order = await this.db.order.findFirst({
      where: {
        userId,
        status: 'DELIVERED',
        items: {
          some: {
            variant: {
              productId: productId
            }
          }
        }
      }
    });
    return !!order;
  }

  async getStats() {
    const totalReviews = await this.db.review.count();
    const approvedReviews = await this.db.review.count({ where: { isActive: true } });
    const pendingApprovals = await this.db.review.count({ where: { isActive: false } });
    const ratings = await this.db.review.aggregate({
      _avg: { rating: true }
    });

    return {
      totalReviews,
      approvedReviews,
      pendingReviews: pendingApprovals,
      pendingApprovals,
      averageRating: ratings._avg.rating || 0
    };
  }
}

export default ReviewRepository;
