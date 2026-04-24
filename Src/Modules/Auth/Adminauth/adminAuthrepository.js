class AdminAuthRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    /**
     * @param {string} email
     */
    async findByEmail(email) {
        return this.prisma.admin.findUnique({
            where: { email },
        });
    }

    async findById(id) {
        return this.prisma.admin.findUnique({ where: { id } });
    }

    async updateLastLogin(id) {
        return this.prisma.admin.update({
            where: { id },
            data: { last_login: new Date() },
        });
    }
}

export default AdminAuthRepository;
