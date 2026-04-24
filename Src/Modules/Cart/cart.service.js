class CartService {
  constructor(cartRepository, sharedCartRepository) {
    this.cartRepository = cartRepository;
    this.sharedCartRepository = sharedCartRepository;
    
    if (!this.sharedCartRepository) {
      console.warn("SharedCartRepository not provided to CartService constructor");
    }
  }

  async shareCart(userId) {
    if (!this.sharedCartRepository) {
      const error = new Error("Cart sharing is currently unavailable.");
      error.statusCode = 503;
      throw error;
    }

    const items = await this.cartRepository.getByUser(userId);
    if (!items || items.length === 0) {
      const error = new Error("Cannot share an empty cart.");
      error.statusCode = 400;
      throw error;
    }

    const snapshot = items.map(item => ({
      variantId: item.productVariantId,
      quantity: item.quantity
    }));

    const shared = await this.sharedCartRepository.create(snapshot);
    return {
      shareId: shared.id,
      url: `${process.env.CLIENT_URL}/cart/shared/${shared.id}`
    };
  }

  async getSharedCart(shareId) {
    const shared = await this.sharedCartRepository.findById(shareId);
    if (!shared) {
      const error = new Error("Shared cart link is invalid or expired.");
      error.statusCode = 404;
      throw error;
    }
    
    // Convert snapshot into full item details
    const formattedItems = await Promise.all(shared.items.map(async (si) => {
       const v = await this.cartRepository.getVariantStockAndPrice(si.variantId);
       if (!v) return null;
       
       const product = v.product;
       const originalPrice = v.price || 0;
       
       return {
         variantId: v.id,
         productId: product.id,
         productName: product.productName,
         image: v.images?.[0]?.imageUrl,
         quantity: si.quantity,
         price: v.discountedPrice || v.price || 0
       };
    }));

    return {
      items: formattedItems.filter(Boolean),
      isShared: true
    };
  }

  async addToCart(userId, productVariantId, quantity) {
    const variant = await this.cartRepository.getVariantStockAndPrice(
      productVariantId
    );

    if (!variant) {
      const error = new Error("Product variant not found.");
      error.statusCode = 404;
      throw error;
    }

    if (!variant.product.isActive) {
      const error = new Error("This product is currently unavailable.");
      error.statusCode = 400;
      throw error;
    }

    if (variant.stock < quantity) {
      const error = new Error(`Only ${variant.stock} units available in stock.`);
      error.statusCode = 400;
      throw error;
    }

    const result = await this.cartRepository.addOrUpdate(
      userId,
      productVariantId,
      quantity
    );
    return {
      message: "Cart updated successfully.",
      count: result.quantity,
    };
  }

  async removeFromCart(userId, productVariantId) {
    const existing = await this.cartRepository.findCartItem(
      userId,
      productVariantId
    );

    if (!existing) {
      return { message: "Item is not in your cart." };
    }

    await this.cartRepository.remove(userId, productVariantId);
    return { message: "Item removed from cart successfully." };
  }

  async clearCart(userId) {
    await this.cartRepository.clearUserCart(userId);
    return { message: "Your shopping cart has been cleared." };
  }

  async getCart(userId) {
    const [cartItems, availableCoins] = await Promise.all([
        this.cartRepository.getByUser(userId),
        this.cartRepository.getUserCoins(userId)
    ]);

    if (!cartItems || cartItems.length === 0) {
      return {
        items: [],
        summary: {
          totalOriginalPrice: 0,
          totalDiscount: 0,
          totalTax: 0,
          totalPayable: 0,
          totalItems: 0,
          availableCoins
        },
        message: "Your shopping bag is empty.",
      };
    }

    let overallOriginalPrice = 0;
    let overallDiscount = 0;
    let overallTax = 0;

    const formattedItems = cartItems.map((item) => {
      const v = item.variant;
      const product = v.product;
      const qty = item.quantity;

      const originalPrice = v.price || 0;
      const variantDiscountAmt = v.discount ? (originalPrice * (v.discount / 100)) : 0;
      
      let offerDiscountAmt = 0;
      let offerPercentage = 0;
      if (product.offers && product.offers.length > 0) {
        const bestOffer = product.offers[0];
        offerPercentage = bestOffer.discountValue;
        if (bestOffer.discountType === "PERCENTAGE") {
          offerDiscountAmt = originalPrice * (offerPercentage / 100);
        } else {
          offerDiscountAmt = bestOffer.discountValue;
        }
      }

      const unitDiscount = variantDiscountAmt + offerDiscountAmt;
      const priceAfterDiscount = originalPrice - unitDiscount;
      const taxRate = product.taxPercentage || 0;
      const taxAmt = priceAfterDiscount * (taxRate / 100);

      const itemOriginalTotal = originalPrice * qty;
      const itemDiscountTotal = unitDiscount * qty;
      const itemTaxTotal = taxAmt * qty;
      const itemFinalTotal = (priceAfterDiscount + taxAmt) * qty;

      overallOriginalPrice += itemOriginalTotal;
      overallDiscount += itemDiscountTotal;
      overallTax += itemTaxTotal;

      const attributes = v.selections?.map(av => 
        `${av.variantName.name}: ${av.variantValue.value}`
      ).join(", ") || "";

      return {
        variantId: v.id,
        productName: product.productName,
        category: product.category?.name,
        brand: product.brand?.brandName,
        attributes,
        image: v.images?.[0]?.imageUrl,
        quantity: qty,
        stockRemaining: v.stock,
        
        pricingPerUnit: {
          originalPrice,
          discountedPrice: priceAfterDiscount,
          taxAmount: taxAmt,
          finalPrice: priceAfterDiscount + taxAmt,
        },

        lineTotal: {
          originalTotal: itemOriginalTotal,
          discountTotal: itemDiscountTotal,
          taxTotal: itemTaxTotal,
          finalTotal: itemFinalTotal,
        },
      };
    });

    return {
      items: formattedItems,
      summary: {
        totalOriginalPrice: overallOriginalPrice,
        totalDiscount: overallDiscount,
        totalTax: overallTax,
        totalPayable: overallOriginalPrice - overallDiscount + overallTax,
        totalItems: formattedItems.length,
        availableCoins
      },
    };
  }
}

export default CartService;
