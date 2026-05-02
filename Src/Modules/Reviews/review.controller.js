import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  async createReview(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { rating, comment, images } = req.body;
      const review = await this.reviewService.createReview(userId, productId, { rating, comment, images });
      return sendSuccess(res, 201, "Review submitted successfully.", review);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      const reviews = await this.reviewService.getProductReviews(productId);
      return sendSuccess(res, 200, "Reviews fetched successfully.", reviews);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllReviews(req, res) {
    try {
      const reviews = await this.reviewService.getAllReviews();
      return sendSuccess(res, 200, "All reviews fetched successfully.", reviews);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive, status } = req.body;
      
      let activeStatus = isActive;
      if (status) {
        activeStatus = status === 'APPROVED';
      }
      
      const review = await this.reviewService.toggleReviewStatus(id, activeStatus);
      return sendSuccess(res, 200, "Review status updated successfully.", review);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      await this.reviewService.deleteReview(id);
      return sendSuccess(res, 200, "Review deleted successfully.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getStats(req, res) {
    try {
      const stats = await this.reviewService.getStats();
      return sendSuccess(res, 200, "Review stats fetched successfully.", stats);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async checkPurchaseEligibility(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const isPurchased = await this.reviewService.checkPurchaseEligibility(userId, productId);
      return sendSuccess(res, 200, "Purchase status checked.", { isPurchased });
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default ReviewController;
