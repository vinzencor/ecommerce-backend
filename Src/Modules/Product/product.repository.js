import prisma from "../../Config/prismaClient.js";

class ProductRepository {
    constructor(prismaClient) {
        this.db = prismaClient || prisma;
    }

    _getDealsInclude() {
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        return {
            where: {
                isActive: true,
                date: {
                    gte: start,
                    lte: end
                },
                OR: [
                    {
                        AND: [
                            { startTime: { lte: now } },
                            { endTime: { gte: now } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: null },
                            { endTime: null }
                        ]
                    }
                ]
            }
        };
    }

    _getStandardInclude() {
        return {
            category: {
                include: {
                    parent: true
                }
            },
            vendor: true,
            brand: true,
            offers: {
                where: {
                    isActive: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() }
                }
            },
            variants: {
                include: {
                    images: true,
                    videos: true,
                    selections: {
                        include: {
                            variantName: true,
                            variantValue: true
                        }
                    }
                }
            },
            deals: this._getDealsInclude()
        };
    }

    async create(data) {
        return this.db.product.create({
            data,
            include: this._getStandardInclude()
        });
    }

    async findAll(skip, take, search = "", categoryId = null, productActive = null, categoryActive = null, fromDate, toDate, vendorId = null) {
        const where = {
            AND: []
        };

        if (productActive !== null) {
            where.AND.push({ isActive: productActive });
        }

        if (categoryActive !== null) {
            where.AND.push({ category: { isActive: categoryActive } });
        }

        if (categoryId) {
            where.AND.push({ categoryId });
        }

        if (vendorId) {
            where.AND.push({ vendorId });
        }

        if (fromDate || toDate) {
            const dateFilter = {};
            if (fromDate) dateFilter.gte = new Date(fromDate);
            if (toDate) {
                const endDay = new Date(toDate);
                endDay.setHours(23, 59, 59, 999);
                dateFilter.lte = endDay;
            }
            where.AND.push({ createdAt: dateFilter });
        }

        if (search) {
            where.AND.push({
                OR: [
                    { productName: { contains: search, mode: "insensitive" } },
                    { brand: { brandName: { contains: search, mode: "insensitive" } } },
                    { searchKeywords: { hasSome: [search] } },
                    { 
                        category: { 
                            name: { contains: search, mode: "insensitive" } 
                        } 
                    },
                    {
                        variants: {
                            some: {
                                OR: [
                                    { sku: { contains: search, mode: "insensitive" } },
                                    {
                                        selections: {
                                            some: {
                                                OR: [
                                                    { variantName: { name: { contains: search, mode: "insensitive" } } },
                                                    { variantValue: { value: { contains: search, mode: "insensitive" } } }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            });
        }

        if (where.AND.length === 0) {
            delete where.AND;
        }

        const [products, total] = await Promise.all([
            this.db.product.findMany({
                where,
                include: this._getStandardInclude(),
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.db.product.count({ where })
        ]);
        return { products, total };
    }

    async findById(id) {
        return this.db.product.findUnique({
            where: { id },
            include: this._getStandardInclude()
        });
    }

    async findByName(productName) {
        return this.db.product.findFirst({
            where: { productName }
        });
    }

    async update(id, data) {
        return this.db.product.update({
            where: { id },
            data,
            include: this._getStandardInclude()
        });
    }

    async toggleStatus(id, isActive) {
        return this.db.product.update({
            where: { id },
            data: { isActive },
        });
    }

    async getStats(vendorId = null) {
        const whereClause = vendorId ? { vendorId } : {};
        const whereActive = vendorId ? { vendorId, isActive: true } : { isActive: true };
        const whereInactive = vendorId ? { vendorId, isActive: false } : { isActive: false };
        const whereStock = vendorId ? { product: { vendorId } } : {};

        const [totalProducts, activeProducts, inactiveProducts, stockData, outOfStockCount] = await Promise.all([
            this.db.product.count({ where: whereClause }),
            this.db.product.count({ where: whereActive }),
            this.db.product.count({ where: whereInactive }),
            this.db.productVariant.aggregate({
                where: whereStock,
                _sum: { stock: true }
            }),
            this.db.product.count({ 
                where: { 
                    ...whereClause,
                    variants: {
                        every: { stock: 0 }
                    }
                } 
            })
        ]);

        let lowStockResult;
        if (vendorId) {
            lowStockResult = await this.db.$queryRaw`
                SELECT COUNT(*)::int as count 
                FROM "Product" p
                WHERE p."vendorId" = ${vendorId}::uuid
                AND (SELECT SUM(pv.stock) FROM "ProductVariant" pv WHERE pv."productId" = p.id) <= p."lowStock" 
                AND p."lowStock" IS NOT NULL
            `;
        } else {
            lowStockResult = await this.db.$queryRaw`
                SELECT COUNT(*)::int as count 
                FROM "Product" p
                WHERE (SELECT SUM(pv.stock) FROM "ProductVariant" pv WHERE pv."productId" = p.id) <= p."lowStock" 
                AND p."lowStock" IS NOT NULL
            `;
        }

        return {
            totalProducts,
            activeProducts,
            inactiveProducts,
            totalStock: stockData._sum.stock || 0,
            outOfStockCount,
            lowStockCount: lowStockResult[0]?.count || 0
        };
    }

    async findVariantBySku(sku) {
        return this.db.productVariant.findUnique({
            where: { sku }
        });
    }

    async findExpiringSoon(days = 30, vendorId = null) {
        const now = new Date();
        const threshold = new Date();
        threshold.setDate(now.getDate() + days);

        const whereClause = {
            variants: {
                some: {
                    expiryDate: {
                        gte: now,
                        lte: threshold
                    }
                }
            }
        };

        if (vendorId) {
            whereClause.vendorId = vendorId;
        }

        return this.db.product.findMany({
            where: whereClause,
            include: this._getStandardInclude(),
            orderBy: { createdAt: "desc" }
        });
    }
}

export default ProductRepository;