class ReturnReasonRepository {
    constructor(prisma) {
        this.db = prisma;
    }

    async create(data) {
        return await this.db.returnReason.create({
            data
        });
    }

    async findAll(query = {}) {
        const { isActive, type } = query;
        const where = {};
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (type) where.type = type;

        return await this.db.returnReason.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id) {
        return await this.db.returnReason.findUnique({
            where: { id }
        });
    }

    async update(id, data) {
        return await this.db.returnReason.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await this.db.returnReason.delete({
            where: { id }
        });
    }
}

export default ReturnReasonRepository;
