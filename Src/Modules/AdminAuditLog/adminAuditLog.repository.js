import prisma from "../../Config/prismaClient.js";

class AdminAuditLogRepository {
    constructor(prisma) {
        this.db = prisma;
    }

    async create(data) {
        return this.db.adminAuditLog.create({ data });
    }

    async findAll(skip, take, adminId, action, entity, search, fromDate, toDate) {
        const where = {};
        if (adminId) where.adminId = adminId;
        if (action) where.action = action;
        if (entity) where.entity = entity;

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
                { action: { contains: search, mode: 'insensitive' } },
                { entity: { contains: search, mode: 'insensitive' } },
                { entityId: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [logs, total] = await Promise.all([
            this.db.adminAuditLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.db.adminAuditLog.count({ where })
        ]);
        return { logs, total };
    }

    async findById(id) {
        return this.db.adminAuditLog.findUnique({
            where: { id }
        });
    }
}

export default AdminAuditLogRepository;
