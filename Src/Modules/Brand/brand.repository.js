import prisma from "../../Config/prismaClient.js";

class BrandRepository {
  constructor(prisma) {
    this.db = prisma;
  }

  async create(data) {
    return this.db.brand.create({
      data,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async findAll(skip, take, filters = {}) {
    const { search, isActive, fromDate, toDate, categoryId } = filters;

    const where = {};

    if (search && search.trim() !== "") {
      where.brandName = { contains: search.trim(), mode: "insensitive" };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (categoryId) {
      where.categoryId = categoryId;
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

    const [brands, total] = await Promise.all([
      this.db.brand.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.db.brand.count({ where }),
    ]);

    return { brands, total };
  }

  async findByCategoryId(categoryId) {
    const categoryIds = [categoryId];

    const cat1 = await this.db.category.findUnique({
      where: { id: categoryId },
      select: { parentId: true },
    });

    if (cat1?.parentId) {
      categoryIds.push(cat1.parentId);

      const cat2 = await this.db.category.findUnique({
        where: { id: cat1.parentId },
        select: { parentId: true },
      });
      if (cat2?.parentId) {
        categoryIds.push(cat2.parentId);
      }
    }

    return this.db.brand.findMany({
      where: {
        categoryId: { in: categoryIds },
        isActive: true,
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { brandName: "asc" },
    });
  }

  async findById(id) {
    return this.db.brand.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async findByNameAndCategory(brandName, categoryId) {
    return this.db.brand.findFirst({ where: { brandName, categoryId } });
  }

  async update(id, data) {
    return this.db.brand.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async toggleStatus(id, isActive) {
    return this.db.brand.update({
      where: { id },
      data: { isActive },
    });
  }

  async delete(id) {
    return this.db.brand.delete({ where: { id } });
  }
}

export default BrandRepository;
