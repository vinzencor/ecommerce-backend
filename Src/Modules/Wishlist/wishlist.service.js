import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class WishlistService {
  constructor(wishlistRepository) {
    this.wishlistRepository = wishlistRepository;
  }

  async toggleWishlist(userId, productId) {
    const product = await this.wishlistRepository.getProductMinimal(productId);

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    if (!product.isActive) {
      const error = new Error("This product is currently unavailable.");
      error.statusCode = 400;
      throw error;
    }

    const existingItem = await this.wishlistRepository.findWishlistItem(
      userId,
      productId
    );

    if (existingItem) {
      await this.wishlistRepository.remove(userId, productId);
      return {
        message: "Product removed from wishlist.",
        isFavourite: false,
      };
    } else {
      await this.wishlistRepository.add(userId, productId);
      return {
        message: "Product added to wishlist.",
        isFavourite: true,
      };
    }
  }

  async removeItem(userId, productId) {
    const existingItem = await this.wishlistRepository.findWishlistItem(
      userId,
      productId
    );

    if (!existingItem) {
      return {
        message: "This item is no longer in your wishlist.",
      };
    }

    await this.wishlistRepository.remove(userId, productId);
    return {
      message: "Item removed from wishlist successfully.",
      isFavourite: false,
    };
  }

  async getUserWishlist(userId) {
    const items = await this.wishlistRepository.getByUser(userId);

    if (!items || items.length === 0) {
      return {
        items: [],
        count: 0,
        message: "Your wishlist is empty.",
      };
    }

    const formattedItems = items.map((item) => {
      const product = item.product;
      const variant = product.variants[0] || null;
      if (!variant) return null;

      const originalPrice = variant.price || 0;
      const variantDiscount = variant.discount || 0;

      let bestOffer = null;
      if (product.offers && product.offers.length > 0) {
        bestOffer = product.offers[0];
      }

      const variantDiscountAmt = originalPrice * (variantDiscount / 100);
      let offerDiscountAmt = 0;
      let offerPercentage = 0;

      if (bestOffer) {
        offerPercentage = bestOffer.discountValue;
        if (bestOffer.discountType === "PERCENTAGE") {
          offerDiscountAmt = originalPrice * (offerPercentage / 100);
        } else {
          offerDiscountAmt = bestOffer.discountValue;
        }
      }

      const totalDiscount = variantDiscountAmt + offerDiscountAmt;
      const discountedPrice = originalPrice - totalDiscount;

      return {
        wishlistId: item.id,
        productId: product.id,
        productName: product.productName,
        category: product.category?.name,
        brand: product.brand?.brandName,
        image: variant.images?.[0]?.imageUrl,
        
        originalPrice,
        discountedPrice,
        variantDiscountPercentage: variantDiscount,
        offerPercentage: offerPercentage,
        
        stock: variant.stock,
        addedAt: item.createdAt,
      };
    }).filter(Boolean);

    return {
      items: formattedItems,
      count: formattedItems.length,
    };
  }
}

export default WishlistService;
