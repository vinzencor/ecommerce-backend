import prisma from "../../Config/prismaClient.js";

class UserRepository {
    async getAll(query) {
        const { page = 1, limit = 10, search = "", isActive, isVerified,fromDate,toDate } = query;
        
        const p = Math.max(1, parseInt(page) || 1);
        const l = Math.max(1, parseInt(limit) || 10);
        const skip = (p - 1) * l;
        
        const where = {};


        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate) where.createdAt.gte = new Date(fromDate);
            if (toDate) {
                const endDay = new Date(toDate);
                endDay.setHours(23, 59, 59, 999);
                where.createdAt.lte = endDay;
            }
        }
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { customId: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (isActive && (isActive === 'true' || isActive === 'false')) {
            where.is_active = isActive === 'true';
        }

        if (isVerified && (isVerified === 'true' || isVerified === 'false')) {
            where.is_verified = isVerified === 'true';
        }

        const [users, total] = await Promise.all([
            prisma.users.findMany({
                where,
                select: {
                    id: true,
                    customId: true,
                    name: true,
                    email: true,
                    phone: true,
                    is_verified: true,
                    is_active: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: l,
            }),
            prisma.users.count({ where })
        ]);

        return { users, total };
    }


    async updateStatus(id, isActive) {
        return await prisma.users.update({
            where: { id },
            data: { is_active: isActive },
            select: {
                id: true,
                name: true,
                email: true,
                is_active: true
            }
        });
    }

    async findById(id) {
        return await prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                customId: true,
                name: true,
                email: true,
                is_active: true,
                is_verified: true
            }
        });
    }

    async getStats() {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7); // Last 7 days

        const [total, active, inactive, joinedThisWeek] = await Promise.all([
            prisma.users.count(),
            prisma.users.count({ where: { is_active: true } }),
            prisma.users.count({ where: { is_active: false } }),
            prisma.users.count({
                where: {
                    createdAt: {
                        gte: startOfWeek
                    }
                }
            })
        ]);

        return {
            totalUsers: total,
            activeUsers: active,
            inactiveUsers: inactive,
            joinedThisWeek
        };
    }
}

export default UserRepository;
