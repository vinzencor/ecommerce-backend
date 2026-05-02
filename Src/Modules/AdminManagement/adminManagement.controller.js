import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class AdminManagementController {
  constructor(adminManagementService) {
    this.adminManagementService = adminManagementService;
  }

  async createSubadmin(req, res) {
    try {
      const admin = await this.adminManagementService.createSubadmin(req.body);
      return sendSuccess(res, 201, "Subadmin created successfully.", admin);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllAdmins(req, res) {
    try {
      const admins = await this.adminManagementService.getAllAdmins();
      return sendSuccess(res, 200, "Admins fetched successfully.", admins);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const admin = await this.adminManagementService.updateAdmin(id, req.body);
      return sendSuccess(res, 200, "Admin updated successfully.", admin);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async deleteAdmin(req, res) {
    try {
      const { id } = req.params;
      await this.adminManagementService.deleteAdmin(id);
      return sendSuccess(res, 200, "Admin deleted successfully.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default AdminManagementController;
