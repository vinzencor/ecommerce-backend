import { sendError, sendResponse } from "../../Utils/apiResponse.js";

class CoupanController {
    constructor(coupanService) {
        this.coupanService = coupanService;
        
        this.createCoupan = this.createCoupan.bind(this);
        this.getAllCoupons = this.getAllCoupons.bind(this);
        this.getCoupanById = this.getCoupanById.bind(this);
        this.updateCoupan = this.updateCoupan.bind(this);
        this.toggleCoupanStatus = this.toggleCoupanStatus.bind(this);
        this.deleteCoupan = this.deleteCoupan.bind(this);
    }

    async createCoupan(req, res) {
        try {
            const coupan = await this.coupanService.create(req.body, req.admin?.id, req);
            return sendResponse(res, 201, "Coupan created successfully.", coupan);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getAllCoupons(req, res) {
        try {
            const { page = 1, limit = 10, search = "", isActive, fromDate, toDate } = req.query;
            const { coupons, total } = await this.coupanService.getAll({ page, limit, search, isActive, fromDate, toDate });

            return sendResponse(res, 200, "Coupons fetched successfully.", {
                coupons,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getCoupanById(req, res) {
        try {
            const coupan = await this.coupanService.getById(req.params.id);
            return sendResponse(res, 200, "Coupan fetched successfully.", coupan);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async updateCoupan(req, res) {
        try {
            const coupan = await this.coupanService.update(req.params.id, req.body, req.admin?.id, req);
            return sendResponse(res, 200, "Coupan updated successfully.", coupan);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleCoupanStatus(req, res) {
        try {
            const coupan = await this.coupanService.toggleStatus(req.params.id, req.body.isActive, req.admin?.id, req);
            return sendResponse(res, 200, "Coupan status toggled successfully.", coupan);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async deleteCoupan(req, res) {
        try {
            const coupan = await this.coupanService.delete(req.params.id, req.admin?.id, req);
            return sendResponse(res, 200, "Coupan deleted successfully.", coupan);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default CoupanController;