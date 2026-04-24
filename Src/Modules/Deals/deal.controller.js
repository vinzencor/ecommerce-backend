import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class DealController {
    constructor(dealService) {
        this.dealService = dealService;

        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getTodayDeals = this.getTodayDeals.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
    }

    async create(req, res) {
        try {
            const adminId = req.admin?.id;
            const deal = await this.dealService.create(req.body, adminId, req);

            return sendSuccess(res, 201, "Deal created successfully.", deal);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findAll(req, res) {
        try {
            const result = await this.dealService.findAll(req.query);
            return sendSuccess(res, 200, "Deals fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findById(req, res) {
        try {
            const deal = await this.dealService.findById(req.params.id);
            if (!deal) {
                const err = new Error("Deal not found.");
                err.statusCode = 404;
                throw err;
            }

            return sendSuccess(res, 200, "Deal fetched successfully.", deal);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async update(req, res) {
        try {
            const adminId = req.admin?.id;
            const deal = await this.dealService.update(req.params.id, req.body, adminId, req);

            return sendSuccess(res, 200, "Deal updated successfully.", deal);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async delete(req, res) {
        try {
            const adminId = req.admin?.id;
            await this.dealService.delete(req.params.id, adminId, req);

            return sendSuccess(res, 200, "Deal deleted successfully.");
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getTodayDeals(req, res) {
        try {
            const deals = await this.dealService.getTodayDeals();

            return sendSuccess(res, 200, "Today's deals fetched successfully.", deals);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleStatus(req, res) {
        try {
            const adminId = req.admin?.id;
            const deal = await this.dealService.toggleStatus(req.params.id, req.body.isActive, adminId, req);

            return sendSuccess(res, 200, "Deal status updated successfully.", deal);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default DealController;


