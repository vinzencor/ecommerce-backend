import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class VariantController {
    constructor(variantService) {
        this.variantService = variantService;

        this.createName = this.createName.bind(this);
        this.findAllNames = this.findAllNames.bind(this);
        this.updateName = this.updateName.bind(this);
        this.toggleNameStatus = this.toggleNameStatus.bind(this);
        this.getByCategory = this.getByCategory.bind(this);
        this.findNameById = this.findNameById.bind(this);
        this.createValue = this.createValue.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.toggleValueStatus = this.toggleValueStatus.bind(this);
    }

    async createValue(req, res) {
        try {
            const adminId = req.admin?.id;
            const value = await this.variantService.createValue(req.body, adminId, req);
            return sendSuccess(res, 201, "Variant value created successfully.", value);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async updateValue(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.admin?.id;
            const value = await this.variantService.updateValue(id, req.body, adminId, req);
            return sendSuccess(res, 200, "Variant value updated successfully.", value);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleValueStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            const adminId = req.admin?.id;
            const value = await this.variantService.toggleValueStatus(id, isActive, adminId, req);
            return sendSuccess(res, 200, "Variant value status toggled successfully.", value);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async createName(req, res) {
        try {
            const variantName = await this.variantService.createName(req.body, req.admin?.id, req);
            return sendSuccess(res, 201, "Variant type created successfully.", variantName);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findNameById(req, res) {
        try {
            const { id } = req.params;
            const variantName = await this.variantService.findNameById(id);
            return sendSuccess(res, 200, "Variant name fetched successfully.", variantName);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findAllNames(req, res) {
        try {
            const { search = "", page = 1, limit = 10, isActive = null, fromDate, toDate } = req.query;
            const { variants, total } = await this.variantService.findAllNames(search, page, limit, isActive, fromDate, toDate);
            
            return sendSuccess(res, 200, "Variant names fetched successfully.", {
                variants,
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

    async updateName(req, res) {
        try {
            const { id } = req.params;
            const variantName = await this.variantService.updateName(id, req.body, req.admin?.id, req);
            return sendSuccess(res, 200, "Variant name updated successfully.", variantName);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleNameStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            const result = await this.variantService.toggleNameStatus(id, isActive, req.admin?.id, req);
            return sendSuccess(res, 200, "Variant status toggled successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }


    async getByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const variants = await this.variantService.getByCategory(categoryId);
            return sendSuccess(res, 200, "Category variants fetched successfully.", variants);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default VariantController;
