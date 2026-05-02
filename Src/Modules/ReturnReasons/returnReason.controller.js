import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class ReturnReasonController {
    constructor(returnReasonService) {
        this.returnReasonService = returnReasonService;

        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res) {
        try {
            const result = await this.returnReasonService.create(req.body);
            return sendSuccess(res, 201, "Return reason created successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findAll(req, res) {
        try {
            const result = await this.returnReasonService.findAll(req.query);
            return sendSuccess(res, 200, "Return reasons fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findById(req, res) {
        try {
            const result = await this.returnReasonService.findById(req.params.id);
            if (!result) return sendError(res, 404, "Return reason not found.");
            return sendSuccess(res, 200, "Return reason fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async update(req, res) {
        try {
            const result = await this.returnReasonService.update(req.params.id, req.body);
            return sendSuccess(res, 200, "Return reason updated successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async delete(req, res) {
        try {
            await this.returnReasonService.delete(req.params.id);
            return sendSuccess(res, 200, "Return reason deleted successfully.");
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default ReturnReasonController;
