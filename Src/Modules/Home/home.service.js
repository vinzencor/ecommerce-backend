class HomeService {
  constructor(homeRepository) {
    this.homeRepository = homeRepository;
  }

  async getHomeScreenData() {
    const rawData = await this.homeRepository.getHomeContent();

    const mapCategory = (cat) => {
      if (!cat) return cat;
      return {
        ...cat,
        imageUrl: cat.image || ""
      };
    };

    return {
      Banner: rawData.banners.filter((b) => b.type === "HOME"),
      categories: rawData.categories.map(mapCategory),
      offers: rawData.offers.map(offer => ({
        ...offer,
        products: offer.products?.map(p => ({
          ...p,
          category: mapCategory(p.category)
        }))
      })),
      dealsOfTheDay: rawData.deals.map(deal => ({
        ...deal,
        product: deal.product ? {
          ...deal.product,
          category: mapCategory(deal.product.category)
        } : null
      })),
      featuredProducts: rawData.featuredProducts.map(p => ({
        ...p,
        category: mapCategory(p.category)
      })),
    };
  }



  async getProductDetails(productId) {
    const product = await this.homeRepository.getProductById(productId);
    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    const taxRate = product.taxPercentage || 0;
    const codCharge = product.codAllowed ? (product.codExtraCharge || 0) : 0;

    let bestOffer = null;
    if (product.offers && product.offers.length > 0) {
      bestOffer = product.offers[0];
    }

    product.variants = product.variants.map((v) => {
      const originalPrice = v.price || 0;

      const variantDiscountAmt = v.discount ? (originalPrice * (v.discount / 100)) : 0;


      let offerDiscountAmt = 0;
      if (bestOffer) {
        if (bestOffer.discountType === "PERCENTAGE") {
          offerDiscountAmt = originalPrice * (bestOffer.discountValue / 100);
        } else {
          offerDiscountAmt = bestOffer.discountValue;
        }
      }

      const totalDiscount = variantDiscountAmt + offerDiscountAmt;
      const priceAfterDiscount = originalPrice - totalDiscount;

      const taxAmt = priceAfterDiscount * (taxRate / 100);

      const finalPrice = priceAfterDiscount + taxAmt;
      const finalPriceWithCOD = finalPrice + codCharge;

      return {
        ...v,
        originalPrice,
        variantDiscountAmount: variantDiscountAmt,
        offerDiscountAmount: offerDiscountAmt,
        totalDiscountAmount: totalDiscount,
        priceAfterDiscount,
        taxAmount: taxAmt,
        codExtraCharge: codCharge,
        finalPrice,
        finalPriceWithCOD,
      };
    });

    return product;
  }



  async getCategoryProducts(categoryId) {
    return this.homeRepository.getProductsByCategory(categoryId);
  }

  async getOfferProducts(offerId) {
    return this.homeRepository.getProductsByOffer(offerId);
  }

  async searchProducts(query, page = 1, limit = 10) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;

    const { products, total } = await this.homeRepository.searchProducts(
      query,
      skip,
      l
    );

    return {
      products,
      pagination: {
        total,
        page: p,
        limit: l,
        pages: Math.ceil(total / l),
      },
    };
  }

  async getFilteredProducts(query) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      minDiscount,
      brandIds,
      hasDiscount,
      variants, 
      sortBy,
      page = 1,
      limit = 10,
    } = query;


    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;

    const filters = {
      categoryId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minDiscount: minDiscount ? parseFloat(minDiscount) : undefined,
      brandIds: brandIds ? brandIds.split(",") : undefined,
      hasDiscount: hasDiscount === "true",
      sortBy,
      skip,
      take: l,
    };

    if (variants) {
      const variantObj = {};
      const pairs = variants.split("|");
      pairs.forEach((pair) => {
        const [name, values] = pair.split(":");
        if (name && values) {
          variantObj[name] = values.split(",");
        }
      });
      filters.variants = variantObj;
    }

    const { products, total } = await this.homeRepository.filterProducts(
      filters
    );

    return {
      products,
      pagination: {
        total,
        page: p,
        limit: l,
        pages: Math.ceil(total / l),
      },
    };
  }

  async getFilterOptions(categoryId) {
    const data = await this.homeRepository.getFilterOptions(categoryId);
    if (!data) {
      const error = new Error("Category not found.");
      error.statusCode = 404;
      throw error;
    }
    return data;
  }
}

export default HomeService;
