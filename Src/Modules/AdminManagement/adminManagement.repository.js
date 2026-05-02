import bcrypt from "bcrypt";

class AdminManagementRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createAdmin(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.db.admin.create({
      data: { ...data, password: hashedPassword }
    });
  }

  async findAll() {
    return await this.db.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        createdAt: true
      }
    });
  }

  async updateAdmin(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.db.admin.update({
      where: { id },
      data
    });
  }

  async deleteAdmin(id) {
    return await this.db.admin.delete({
      where: { id }
    });
  }
}

export default AdminManagementRepository;
