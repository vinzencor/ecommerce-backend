import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class UserController {
    constructor(userService) {
        this.userService = userService;
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.toggleUserStatus = this.toggleUserStatus.bind(this);
        this.getUserStats = this.getUserStats.bind(this);
    }

    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = "", isActive, isVerified,fromDate,toDate } = req.query;
            const { users, total } = await this.userService.getAll({ page, limit, search, isActive, isVerified,fromDate,toDate });

            return sendSuccess(res, 200, "Users fetched successfully.", {
                users,
                pagination: {
                    total,
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10
                }
            });
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.userRepository.findById(id);
            if (!user) return sendError(res, 404, "User not found.");
            return sendSuccess(res, 200, "User fetched successfully.", user);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getUserStats(req, res) {
        try {
            const stats = await this.userService.getStats();
            return sendSuccess(res, 200, "User statistics fetched successfully.", stats);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            
            const user = await this.userService.toggleStatus(id, isActive, req.admin?.id, req);
            
            const message = isActive 
                ? "User has been activated successfully." 
                : "User has been deactivated successfully.";
                
            return sendSuccess(res, 200, message, user);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default UserController;
