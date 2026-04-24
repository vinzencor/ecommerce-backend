import prisma from "../../Config/prismaClient.js";

class VariantRepository {
    constructor(prisma) {
        this.db = prisma;
    }

    async createName(data) {
        return this.db.variantName.create({ data });
    }

    async findAllNames(skip, take, search = "", isActive = null, fromDate, toDate) {
        const where = {};
        
        if (isActive !== null) {
            where.isActive = isActive;
        }

        if (search) {
            where.name = { contains: search, mode: "insensitive" };
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

        const [variants, total] = await Promise.all([
            this.db.variantName.findMany({
                where,
                include: { values: true },
                orderBy: { createdAt: "desc" },
                skip,
                take
            }),
            this.db.variantName.count({ where })
        ]);
        return { variants, total };
    }

    async findNameById(id) {
        return this.db.variantName.findUnique({
            where: { id },
            include: { 
                values: true,
                categoryBy: {
                    select: { categoryId: true }
                }
            }
        });
    }

    async findNameByName(name) {
        return this.db.variantName.findUnique({
            where: { name }
        });
    }

    async updateName(id, data) {
        return this.db.variantName.update({
            where: { id },
            data
        });
    }

    async toggleNameStatus(id, isActive) {
        return this.db.variantName.update({
            where: { id },
            data: { isActive }
        });
    }

    // Variant Value
    async createValue(data) {
        return this.db.variantValue.create({ data });
    }

    async findValueById(id) {
        return this.db.variantValue.findUnique({ where: { id } });
    }

    async updateValue(id, data) {
        return this.db.variantValue.update({
            where: { id },
            data
        });
    }

    async toggleValueStatus(id, isActive) {
        return this.db.variantValue.update({
            where: { id },
            data: { isActive }
        });
    }

    async linkToCategory(categoryId, variantNameIds) {
        await this.db.categoryVariant.deleteMany({
            where: { categoryId }
        });

        const data = variantNameIds.map(variantNameId => ({
            categoryId,
            variantNameId
        }));

        return this.db.categoryVariant.createMany({
            data
        });
    }

    async addCategoryLink(categoryId, variantNameId) {
        return this.db.categoryVariant.upsert({
            where: {

                id: (await this.db.categoryVariant.findFirst({
                    where: { categoryId, variantNameId }
                }))?.id || ""
            },
            create: { categoryId, variantNameId },
            update: {} 
        });
    }

    async findVariantsByCategory(categoryId) {
        const getAllCategoryIds = async (id, ids = []) => {
            const cat = await this.db.category.findUnique({
                where: { id },
                select: { id: true, parentId: true }
            });
            if (!cat) return ids;
            ids.push(cat.id);
            if (cat.parentId) {
                return getAllCategoryIds(cat.parentId, ids);
            }
            return ids;
        };

        const categoryIds = await getAllCategoryIds(categoryId);

        const categoryVariants = await this.db.categoryVariant.findMany({
            where: {
                categoryId: { in: categoryIds },
                variantName: { isActive: true }
            },
            include: {
                variantName: {
                    include: {
                        values: true
                    }
                }
            }
        });

        const uniqueVariantsMap = new Map();
        categoryVariants.forEach(cv => {
            if (!uniqueVariantsMap.has(cv.variantNameId)) {
                uniqueVariantsMap.set(cv.variantNameId, cv.variantName);
            }
        });

        return Array.from(uniqueVariantsMap.values());
    }
}

export default VariantRepository;
