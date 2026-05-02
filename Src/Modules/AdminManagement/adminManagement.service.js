class AdminManagementService {
  constructor(adminManagementRepository) {
    this.adminManagementRepository = adminManagementRepository;
  }

  async createSubadmin(data) {
    return await this.adminManagementRepository.createAdmin({
      ...data,
      role: 'subadmin'
    });
  }

  async getAllAdmins() {
    return await this.adminManagementRepository.findAll();
  }

  async updateAdmin(id, data) {
    return await this.adminManagementRepository.updateAdmin(id, data);
  }

  async deleteAdmin(id) {
    return await this.adminManagementRepository.deleteAdmin(id);
  }
}

export default AdminManagementService;
