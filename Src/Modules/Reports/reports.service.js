class ReportsService {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async getSalesDashboard(startDate, endDate) {
    const where = this._getDateRange(startDate, endDate);

    // Sales Trend (Revenue by day)
    const orders = await this.db.order.findMany({
      where: {
        ...where,
        status: { not: "CANCELLED" },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const trend = this._groupByDate(orders, "totalAmount");

    // Revenue by Category
    const orderItems = await this.db.orderItem.findMany({
      where: {
        order: {
          ...where,
          status: { not: "CANCELLED" },
        },
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const categoryRevenue = {};
    orderItems.forEach((item) => {
      const categoryName = item.variant.product.category.name;
      categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + item.price * item.quantity;
    });

    const formattedCategoryRevenue = Object.entries(categoryRevenue).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      trend,
      categoryRevenue: formattedCategoryRevenue,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      totalOrders: orders.length,
    };
  }

  async getOrdersReport(startDate, endDate) {
    const where = this._getDateRange(startDate, endDate);

    const orders = await this.db.order.groupBy({
      by: ["status"],
      where,
      _count: {
        id: true,
      },
    });

    const statusStats = orders.map((o) => ({
      status: o.status,
      count: o._count.id,
    }));

    return {
      statusStats,
    };
  }

  async getUsersReport(startDate, endDate) {
    const where = this._getDateRange(startDate, endDate);

    const users = await this.db.users.findMany({
      where,
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const growth = this._groupByDate(users, null, "count");

    return {
      growth,
      totalUsers: await this.db.users.count({ where }),
    };
  }

  async getProductsReport(startDate, endDate) {
    const where = this._getDateRange(startDate, endDate);

    const orderItems = await this.db.orderItem.findMany({
      where: {
        order: where,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    const productStats = {};
    orderItems.forEach((item) => {
      const productId = item.variant.productId;
      if (!productStats[productId]) {
        productStats[productId] = {
          id: productId,
          name: item.variant.product.productName,
          sales: 0,
          revenue: 0,
        };
      }
      productStats[productId].sales += item.quantity;
      productStats[productId].revenue += item.price * item.quantity;
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      topProducts,
    };
  }

  async getVendorsReport(startDate, endDate) {
    const where = this._getDateRange(startDate, endDate);

    const orderItems = await this.db.orderItem.findMany({
      where: {
        order: where,
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                vendor: true,
              },
            },
          },
        },
      },
    });

    const vendorStats = {};
    orderItems.forEach((item) => {
      const vendor = item.variant.product.vendor;
      if (!vendor) return;
      
      const vendorId = vendor.id;
      if (!vendorStats[vendorId]) {
        vendorStats[vendorId] = {
          id: vendorId,
          name: vendor.name,
          orders: new Set(),
          revenue: 0,
        };
      }
      vendorStats[vendorId].orders.add(item.orderId);
      vendorStats[vendorId].revenue += item.price * item.quantity;
    });

    const topVendors = Object.values(vendorStats).map(v => ({
        ...v,
        orders: v.orders.size
    }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      topVendors,
    };
  }

  async getCouponsReport(startDate, endDate) {
    // Current schema doesn't seem to track which coupon was used on which order
    // But we can return general coupon stats
    const coupons = await this.db.coupan.findMany({
        where: {
            createdAt: this._getDateRange(startDate, endDate).createdAt
        }
    });

    return {
      coupons: coupons.map(c => ({
          code: c.code,
          usedCount: c.usedCount,
          discountType: c.discountType,
          discountValue: c.discountValue,
          isActive: c.isActive
      }))
    };
  }

  _getDateRange(startDate, endDate) {
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return where;
  }

  _groupByDate(data, valueField, type = "sum") {
    const groups = {};
    data.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (!groups[date]) groups[date] = 0;
      if (type === "sum") {
        groups[date] += item[valueField];
      } else {
        groups[date] += 1;
      }
    });
    return Object.entries(groups).map(([date, value]) => ({ date, value }));
  }
}

export default ReportsService;
