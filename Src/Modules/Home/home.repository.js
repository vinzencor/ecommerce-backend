class HomeRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async getHomeContent() {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const safeQuery = async (label, queryFn) => {
      try {
        return await queryFn();
      } catch (error) {
        console.error(`Home query failed (${label}):`, error?.message || error);
        return [];
      }
    };

    const [banners, categories, featuredProducts, deals, offers] = await Promise.all([
      safeQuery("banners", () => this.db.banner.findMany({
        where: {
          isActive: true,
          AND: [
            { OR: [{ startDate: null }, { startDate: { lte: now } }] },
            { OR: [{ endDate: null }, { endDate: { gte: now } }] },
          ],
        },
        orderBy: { createdAt: "desc" },
      })),
      safeQuery("categories", () => this.db.category.findMany({
        where: { level: "TITLE", isActive: true },
        take: 7,
      })),
      safeQuery("featuredProducts", () => this.db.product.findMany({
        where: { isFeatured: true, isActive: true },
        take: 8,
        include: {
          variants: {
            where: { isPrimary: true },
            take: 1,
            include: { images: true },
          },
          category: { select: { id: true, name: true, image: true } },
          brand: { select: { id: true, brandName: true } },
        },
      })),
      safeQuery("deals", () => this.db.dealOfTheDay.findMany({
        where: {
          isActive: true
        },
        include: {
          product: {
            include: {
              variants: { where: { isPrimary: true }, take: 1, include: { images: true } },
              category: { select: { id: true, name: true, image: true } },
              brand: { select: { id: true, brandName: true } },
            },
          },
        },
      })),
      safeQuery("offers", () => this.db.offer.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        include: {
          products: {
            take: 4,
            include: {
              variants: { where: { isPrimary: true }, take: 1, include: { images: true } },
              category: { select: { id: true, name: true, image: true } },
              brand: { select: { id: true, brandName: true } },
            },
          },
        },
      })),
    ]);


    
    return { banners, categories, featuredProducts, deals, offers };
  }



  async getProductById(id) {
    return this.db.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: { select: { name: true, id: true, image: true } },
        brand: { select: { brandName: true, image: true } },
        variants: {
          include: {
            images: true,
            videos: true,
            selections: {
              include: {
                variantName: true,
                variantValue: true,
              },
            },
          },
        },
        offers: {
          where: {
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        },
      },
    });
  }

  async getProductsByCategory(categoryId, skip = 0, take = 10) {
    const categoryWithChildren = await this.db.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });


    if (!categoryWithChildren) return { products: [], total: 0 };

    const allCategoryIds = [categoryWithChildren.id];
    categoryWithChildren.children.forEach((mainCat) => {
      allCategoryIds.push(mainCat.id);
      mainCat.children.forEach((subCat) => {
        allCategoryIds.push(subCat.id);
      });
    });

    const where = {
      categoryId: { in: allCategoryIds },
      isActive: true,
    };

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take,
        include: {
          variants: {
            where: { isPrimary: true },
            take: 1,
            include: { images: true },
          },
          category: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async getProductsByOffer(offerId) {
    const offer = await this.db.offer.findUnique({
      where: { id: offerId, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          include: {
            variants: {
              where: { isPrimary: true },
              take: 1,
              include: { images: true },
            },
            category: { select: { name: true, image: true } },
          },
        },
      },
    });
    return offer ? offer.products : [];
  }

  async searchProducts(query, skip, take) {
    const where = {
      isActive: true,
      OR: [
        { productName: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
        { brand: { brandName: { contains: query, mode: "insensitive" } } },
        { searchKeywords: { hasSome: [query] } },
      ],
    };

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take,
        include: {
          variants: { where: { isPrimary: true }, take: 1, include: { images: true } },
          category: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async filterProducts(filters) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      minDiscount,
      brandIds,
      hasDiscount,
      variants,
      sortBy,
      skip = 0,
      take = 10,
    } = filters;

    const where = { isActive: true, AND: [] };

    if (categoryId) {
      const categories = await this.db.category.findUnique({
        where: { id: categoryId },
        include: { children: { include: { children: true } } },
      });
      if (categories) {
        const ids = [categories.id];
        categories.children.forEach((c1) => {
          ids.push(c1.id);
          c1.children.forEach((c2) => ids.push(c2.id));
        });
        where.AND.push({ categoryId: { in: ids } });
      }
    }

    if (brandIds && brandIds.length > 0) {
      where.AND.push({ brandId: { in: brandIds } });
    }

    const variantWhere = { AND: [] };

    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice !== undefined ? minPrice : 0;
      const max = maxPrice !== undefined ? maxPrice : Number.MAX_SAFE_INTEGER;

      variantWhere.AND.push({
        OR: [
          {
            AND: [
              { discountedPrice: { not: null } },
              { discountedPrice: { gte: min, lte: max } },
            ],
          },
          {
            AND: [
              { discountedPrice: null },
              { price: { gte: min, lte: max } },
            ],
          },
        ],
      });
    }

    if (minDiscount !== undefined)
      variantWhere.AND.push({ discount: { gte: minDiscount } });

    if (hasDiscount) {
     
      variantWhere.AND.push({
        OR: [
            { discountedPrice: { lt: this.db.productVariant.fields.price } },
            { discount: { gt: 0 } }
        ]
      });
    }

    if (variants && Object.keys(variants).length > 0) {
      Object.entries(variants).forEach(([name, values]) => {
        variantWhere.AND.push({
          selections: {
            some: {
              variantName: { name: name },
              variantValue: { value: { in: values } },
            },
          },
        });
      });
    }

    if (variantWhere.AND.length > 0) {
      where.AND.push({ variants: { some: variantWhere } });
    }

    let orderBy = { createdAt: "desc" };
    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    }
  

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take,
        include: {
          variants: {
            where: { isPrimary: true },
            take: 1,
            include: { images: true },
          },
          category: { select: { name: true, image: true } },
        },
        orderBy,
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async getFilterOptions(categoryId) {
    const categories = await this.db.category.findUnique({
      where: { id: categoryId },
      include: { children: { include: { children: true } } },
    });

    if (!categories) return null;

    const ids = [categories.id];
    categories.children.forEach((c1) => {
      ids.push(c1.id);
      c1.children.forEach((c2) => ids.push(c2.id));
    });

    const products = await this.db.product.findMany({
      where: { categoryId: { in: ids }, isActive: true },
      select: {
        brand: { select: { id: true, brandName: true } },
        variants: {
          select: {
            price: true,
            discountedPrice: true,
            discount: true,
            selections: {
              select: {
                variantName: { select: { name: true, id: true } },
                variantValue: { select: { value: true, id: true } },
              },
            },
          },
        },
      },
    });

    const brands = new Map();
    const variantMap = new Map();
    const discounts = new Set();
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let hasDiscounts = false;

    products.forEach((p) => {
      if (p.brand) {
        brands.set(p.brand.id, p.brand.brandName);
      }

      p.variants.forEach((v) => {
        const currentPrice = v.discountedPrice ?? v.price;

        if (v.discount && v.discount > 0) {
          discounts.add(Math.floor(v.discount));
          hasDiscounts = true;
        }

        if (v.discountedPrice !== null && v.discountedPrice < v.price) {
          hasDiscounts = true;
        }

        if (currentPrice !== null && currentPrice !== undefined) {
          if (currentPrice < minPrice) minPrice = currentPrice;
          if (currentPrice > maxPrice) maxPrice = currentPrice;
        }

        v.selections.forEach((sel) => {
          const vName = sel.variantName.name;
          const vValue = { id: sel.variantValue.id, value: sel.variantValue.value };

          if (!variantMap.has(vName)) {
            variantMap.set(vName, new Map());
          }

          const valuesMap = variantMap.get(vName);
          if (!valuesMap.has(vValue.id)) {
            valuesMap.set(vValue.id, vValue);
          }
        });
      });
    });

    const formattedVariants = Array.from(variantMap.entries()).map(([name, valuesMap]) => ({
      name,
      values: Array.from(valuesMap.values()),
    }));

    return {
      brands: Array.from(brands.entries()).map(([id, name]) => ({ id, name })),
      variants: formattedVariants,
      discounts: Array.from(discounts).sort((a, b) => b - a),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === -Infinity ? 0 : maxPrice,
      },
      hasDiscounts: hasDiscounts,
    };
  }


}

export default HomeRepository;
