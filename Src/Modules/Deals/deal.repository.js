import prisma from "../../Config/prismaClient.js";

class DealRepository {
    constructor(prismaClient) {
        this.db = prismaClient || prisma;
    }

    async create(data) {
        return this.db.dealOfTheDay.create({
            data,
            include: {
                product: {
                    include: {
                        variants: {
                            include: {
                                images: true
                            }
                        }
                    }
                }
            }
        });
    }

    async findAll(filters = {}) {
        const { isActive, fromDate, toDate, search, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {
            AND: []
        };

        if (isActive !== undefined) {
            where.AND.push({ isActive });
        }

        if (search) {
            where.AND.push({
                product: {
                    productName: { contains: search, mode: "insensitive" }
                }
            });
        }
        
        if (fromDate || toDate) {
            const dateFilter = {};
            if (fromDate) dateFilter.gte = new Date(fromDate);
            if (toDate) {
                const endDay = new Date(toDate);
                endDay.setHours(23, 59, 59, 999);
                dateFilter.lte = endDay;
            }
            where.AND.push({ date: dateFilter });
        }

        if (where.AND.length === 0) {
            delete where.AND;
        }

        const [deals, total] = await Promise.all([
            this.db.dealOfTheDay.findMany({
                where,
                include: {
                    product: {
                        include: {
                            variants: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                },
                orderBy: { date: "desc" },
                skip,
                take
            }),
            this.db.dealOfTheDay.count({ where })
        ]);

        return { deals, total };
    }

    async findById(id) {
        return this.db.dealOfTheDay.findUnique({
            where: { id },
            include: {
                product: {
                    include: {
                        variants: {
                            include: {
                                images: true
                            }
                        }
                    }
                }
            }
        });
    }

    async update(id, data) {
        return this.db.dealOfTheDay.update({
            where: { id },
            data,
            include: {
                product: {
                    include: {
                        variants: {
                            include: {
                                images: true
                            }
                        }
                    }
                }
            }
        });
    }

    async delete(id) {
        return this.db.dealOfTheDay.delete({
            where: { id }
        });
    }

    async findTodayDeals() {
        const now = new Date();
        
        return this.db.dealOfTheDay.findMany({
            where: {
                isActive: true
            },
            include: {
                product: {
                    include: {
                        variants: {
                            include: {
                                images: true
                            }
                        }
                    }
                }
            }
        });
    }

    async toggleStatus(id, isActive) {
        return this.db.dealOfTheDay.update({
            where: { id },
            data: { isActive },
            include: {
                product: {
                    include: {
                        variants: {
                            include: {
                                images: true
                            }
                        }
                    }
                }
            }
        });
    }
}

export default DealRepository;
