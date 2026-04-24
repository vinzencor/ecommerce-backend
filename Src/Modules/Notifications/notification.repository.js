import prisma from "../../Config/prismaClient.js";

class NotificationRepository {
    async create(data) {
        return await prisma.notification.create({
            data
        });
    }

    async createUserNotifications(data) {
        return await prisma.userNotification.createMany({
            data,
            skipDuplicates: true
        });
    }

    async findScheduled(now) {
        return await prisma.notification.findMany({
            where: {
                sentAt: { lte: now },
                recipients: { none: {} } 
            }
        });
    }

    async findAll(query) {
        const { page = 1, limit = 10, search, fromDate, toDate } = query;
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 10;
        const skip = (p - 1) * l;

        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } }
            ];
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

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: l,
                include: {
                    _count: {
                        select: { recipients: true }
                    }
                }
            }),
            prisma.notification.count({ where })
        ]);

        return { notifications, total };
    }

    async findById(id) {
        return await prisma.notification.findUnique({
            where: { id },
            include: {
                recipients: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

  

    async delete(id) {
        return await prisma.notification.delete({
            where: { id }
        });
    }

    async getAllUserIds() {
        const users = await prisma.users.findMany({
            select: { id: true }
        });
        return users.map(u => u.id);
    }
}

export default NotificationRepository;
