import prisma from "../../Config/prismaClient.js";

class OfferRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(payload) {
        return this.prisma.offer.create({ data: payload });
    }

    async getAll(query = {}) {
        const { page = 1, limit = 10, search, isActive, fromDate, toDate } = query;
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 10;
        const skip = (p - 1) * l;

        const where = {};

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
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

        const [offers, total] = await Promise.all([
            this.prisma.offer.findMany({
                where,
                include: {
                    products: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: l
            }),
            this.prisma.offer.count({ where })
        ]);

        return { offers, total };
    }

    async getById(id) {
        return this.prisma.offer.findUnique({ 
            where: { id },
            include: {
                products: true
            }
        });
    }

    async update(id, payload) {
        return this.prisma.offer.update({ where: { id }, data: payload });
    }

    async delete(id) {
        return this.prisma.offer.delete({ where: { id } });
    }

    async toggleStatus(id, isActive) {
        return this.prisma.offer.update({
            where: { id },
            data: { isActive }
        });
    }
}

export default OfferRepository;
