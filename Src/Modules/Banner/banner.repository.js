import prisma from "../../Config/prismaClient.js";

class BannerRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient || prisma;
  }

  async create(payload) {
    return this.prisma.banner.create({
      data: payload,
      include: {
        products: true,
      },
    });
  }

  async getAll(filters = {}) {
    const { search, isActive, fromDate, toDate } = filters;
    const where = {};

    if (search && search.trim()) {
      where.title = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = new Date(fromDate);
        if (toDate) {
            const endDay = new Date(toDate);
            endDay.setHours(23, 59, 59, 999);
            where.createdAt.lte = endDay;
        }
    }

    return this.prisma.banner.findMany({
      where,
      include: {
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id) {
    return this.prisma.banner.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async update(id, payload) {
    return this.prisma.banner.update({
      where: { id },
      data: payload,
      include: {
        products: true,
      },
    });
  }

  async delete(id) {
    return this.prisma.banner.delete({ where: { id } });
  }

  async toggleStatus(id, isActive) {
    return this.prisma.banner.update({
      where: { id },
      data: { isActive },
    });
  }
}

export default BannerRepository;
