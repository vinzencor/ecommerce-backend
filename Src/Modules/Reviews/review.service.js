class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async createReview(userId, productId, data) {
    const hasPurchased = await this.reviewRepository.checkPurchase(userId, productId);
    
    if (!hasPurchased) {
      const error = new Error("You can only review products you have purchased and received.");
      error.statusCode = 403;
      throw error;
    }

    const existingReview = await this.reviewRepository.findByUserAndProduct(userId, productId);
    if (existingReview) {
      const error = new Error("You have already reviewed this product.");
      error.statusCode = 400;
      throw error;
    }

    return await this.reviewRepository.createReview({
      userId,
      productId,
      isPurchased: true,
      ...data
    });
  }

  async getProductReviews(productId) {
    return await this.reviewRepository.findByProductId(productId);
  }

  async getAllReviews() {
    const reviews = await this.reviewRepository.findAll();
    return reviews.map(review => ({
      ...review,
      userName: review.user?.name,
      productName: review.product?.productName,
      status: review.isActive ? 'APPROVED' : 'PENDING'
    }));
  }

  async toggleReviewStatus(reviewId, isActive) {
    return await this.reviewRepository.updateStatus(reviewId, isActive);
  }

  async deleteReview(reviewId) {
    return await this.reviewRepository.deleteReview(reviewId);
  }

  async getStats() {
    return await this.reviewRepository.getStats();
  }

  async checkPurchaseEligibility(userId, productId) {
    return await this.reviewRepository.checkPurchase(userId, productId);
  }
}

export default ReviewService;
