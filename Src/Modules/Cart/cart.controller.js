import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.getCart = this.getCart.bind(this);
    this.shareCart = this.shareCart.bind(this);
    this.getSharedCart = this.getSharedCart.bind(this);
  }

  async shareCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await this.cartService.shareCart(userId);
      return sendSuccess(res, 200, "Cart shared successfully.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getSharedCart(req, res) {
    try {
      const { shareId } = req.params;
      const data = await this.cartService.getSharedCart(shareId);
      return sendSuccess(res, 200, "Shared cart fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productVariantId, quantity } = req.body;

      if (!productVariantId) {
        return sendError(res, 400, "Product Variant ID is required.");
      }

      if (!quantity || quantity <= 0) {
        return sendError(res, 400, "Quantity must be at least 1.");
      }

      const result = await this.cartService.addToCart(
        userId,
        productVariantId,
        parseInt(quantity)
      );
      return sendSuccess(res, 200, result.message, result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { variantId } = req.params;

      const result = await this.cartService.removeFromCart(userId, variantId);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await this.cartService.clearCart(userId);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const data = await this.cartService.getCart(userId);
      return sendSuccess(res, 200, "Shopping bag fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default CartController;
