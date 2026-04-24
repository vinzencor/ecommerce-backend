import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class WishlistController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
    this.toggleWishlist = this.toggleWishlist.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.getWishlist = this.getWishlist.bind(this);
  }

  async toggleWishlist(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      if (!productId) {
        return sendError(res, 400, "Product ID is required.");
      }

      const result = await this.wishlistService.toggleWishlist(userId, productId);
      
      return sendSuccess(res, 200, result.message, result);
    } catch (error) {
      console.error("Wishlist Error:", error);
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const result = await this.wishlistService.removeItem(userId, productId);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getWishlist(req, res) {
    try {
      const userId = req.user.id;
      const data = await this.wishlistService.getUserWishlist(userId);
      return sendSuccess(res, 200, "Wishlist fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default WishlistController;
