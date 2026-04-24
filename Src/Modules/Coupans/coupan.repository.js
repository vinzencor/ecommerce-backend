import prisma from "../../Config/prismaClient.js";

class CoupanRepository {
    async create(data) {
        return await prisma.coupan.create({
            data: {
                code: data.code,
                discountType: data.discountType,
                discountValue: data.discountValue,
                minOrderAmount: data.minOrderAmount,
                maxDiscountAmount: data.maxDiscountAmount,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                usageLimit: data.usageLimit,
                usedCount: data.usedCount || 0,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });
    }

    async getAll(query) {
        const { page, limit, search = "", isActive, fromDate, toDate } = query;
        
        const p = Math.max(1, parseInt(page) || 1);
        const l = Math.max(1, parseInt(limit) || 10);
        const skip = (p - 1) * l;
        
        const where = {};
        if (search) {
            where.code = { contains: search, mode: 'insensitive' };
        }
        
        if (isActive !== undefined) {
            where.isActive = isActive === 'true' || isActive === true;
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

        const [coupons, total] = await Promise.all([
            prisma.coupan.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: l,
            }),
            prisma.coupan.count({ where })
        ]);

        return { coupons, total };
    }

    async getById(id) {
        return await prisma.coupan.findUnique({
            where: {
                id: id,
            },
        });
    }

    async update(id, data) {
        const updateData = { ...data };
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);

        return await prisma.coupan.update({
            where: {
                id: id,
            },
            data: updateData,
        });
    }

    async toggleStatus(id, isActive) {
        return await prisma.coupan.update({
            where: {
                id: id,
            },
            data: {
                isActive: isActive,
            },
        });
    }

    async delete(id) {
        return await prisma.coupan.delete({
            where: {
                id: id,
            },
        });
    }
}

export default CoupanRepository;
