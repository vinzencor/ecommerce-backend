class CommissionRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createCommission(data) {
    return await this.db.commission.create({
      data,
      include: { 
        vendor: { select: { name: true, BusinessName: true } },
        order: { select: { orderNumber: true, totalAmount: true } }
      }
    });
  }

  async findByVendorId(vendorId) {
    return await this.db.commission.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll() {
    return await this.db.commission.findMany({
      include: { 
        vendor: { select: { name: true, BusinessName: true } },
        order: { select: { orderNumber: true, totalAmount: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getVendorsWithCommission(search = "", vendorFilter = "all") {
    const where = {
      isApproved: "APPROVED"
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { BusinessName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ];
    }

    if (vendorFilter === "set") {
      where.commissionPercentage = { gt: 0 };
    } else if (vendorFilter === "unset") {
      where.commissionPercentage = 0;
    }

    const vendors = await this.db.vendor.findMany({
      where,
      select: {
        id: true,
        name: true,
        BusinessName: true,
        email: true,
        commissionPercentage: true,
        is_active: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return vendors.map(v => ({
      ...v,
      vendorName: v.name,
      storeName: v.BusinessName || v.name
    }));
  }

  async updateVendorCommission(vendorId, percentage) {
    return await this.db.vendor.update({
      where: { id: vendorId },
      data: { commissionPercentage: parseFloat(percentage) }
    });
  }

  async getAvailableVendors() {
    const vendors = await this.db.vendor.findMany({
      where: { 
        isApproved: "APPROVED",
        is_active: true
      },
      select: {
        id: true,
        name: true,
        BusinessName: true
      }
    });

    return vendors.map(v => ({
      ...v,
      storeName: v.BusinessName || v.name
    }));
  }


  async getCommissionStats() {
    const [totalCommissions, vendorStats] = await Promise.all([
      this.db.commission.aggregate({
        _sum: { amount: true },
        _count: { id: true }
      }),
      this.db.vendor.aggregate({
        _count: { id: true },
        _avg: { commissionPercentage: true }
      })
    ]);

    return {
      totalAmount: totalCommissions._sum.amount || 0,
      totalCount: totalCommissions._count.id || 0,
      vendorCount: vendorStats._count.id || 0,
      averagePercentage: vendorStats._avg.commissionPercentage || 0
    };
  }
}

export default CommissionRepository;
