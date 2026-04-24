import prisma from "../../Config/prismaClient.js";

class CategoryRepository {
    constructor(prisma) {
        this.db = prisma;
    }

    async create(data) {
        return this.db.category.create({ data });
    }

    async findAll(skip, take) {
        const [categories, total] = await Promise.all([
            this.db.category.findMany({
                where: { isActive: true, parentId: null }, // top-level categories only
                include: {
                    children: {
                        where: { isActive: true },
                        include: {
                            children: { where: { isActive: true } }, // up to 2 levels deep
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.db.category.count({ where: { isActive: true, parentId: null } })
        ]);
        return { categories, total };
    }

    async findAllWithoutPagination(level ,fromDate,toDate) {
        const where = { isActive: true };
        if (level) {
            where.level = level;
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

        return this.db.category.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                parent: true,
                children: {
                    where: { isActive: true }
                }
            }
        });
    }

    async findById(id) {
        return this.db.category.findUnique({
            where: { id },
            include: {
                children: { where: { isActive: true } },
                parent: true,
                variants: {
                    include: {
                        variantName: {
                            include: { values: true }
                        }
                    }
                }
            },
        });
    }

    async findByLevel(level, skip, take, search, isActive, fromDate, toDate) {
        const where = { level };

        if (isActive === "true" || isActive === true) {
            where.isActive = true;
        } else if (isActive === "false" || isActive === false) {
            where.isActive = false;
        }

        if (search && search.trim() !== "") {
            where.name = { contains: search.trim(), mode: "insensitive" };
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

        const [categories, total] = await Promise.all([
            this.db.category.findMany({
                where,
                include: {
                    parent: true
                },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.db.category.count({ where })
        ]);
        return { categories, total };
    }

    async findByName(name) {
        return this.db.category.findFirst({ where: { name } });
    }

    async update(id, data) {
        return this.db.category.update({ where: { id }, data });
    }

    async toggleStatus(id, isActive) {
        return this.db.category.update({
            where: { id },
            data: { isActive },
        });
    }




}

export default CategoryRepository;