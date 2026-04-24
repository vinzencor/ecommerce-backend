import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class AdminAuditLogController {
    constructor(adminAuditLogService) {
        this.adminAuditLogService = adminAuditLogService;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
    }

    async getAll(req, res) {
        try {
            let { page, limit, adminId, action, entity, search, fromDate, toDate } = req.query;

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 20;

            const result = await this.adminAuditLogService.getAll(
                page,
                limit,
                adminId,
                action,
                entity,
                search,
                fromDate,
                toDate
            );

            const safeLogs = result.logs.map(log => {
                const { oldValue: _, newValue: __, ...safeLog } = log;
                return safeLog;
            });

            return sendSuccess(res, 200, "Audit logs fetched successfully.", {
                logs: safeLogs,
                pagination: {
                    total: result.total,
                    page,
                    limit
                }
            });

        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const log = await this.adminAuditLogService.getById(id);
            if (!log) {
                return sendError(res, 404, "Audit log not found.");
            }

            const { oldValue: _, newValue: __, ...safeLog } = log;
            return sendSuccess(res, 200, "Audit log fetched successfully.", safeLog);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }
}

export default AdminAuditLogController;
