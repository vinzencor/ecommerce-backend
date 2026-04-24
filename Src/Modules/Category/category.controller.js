import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;

        this.create       = this.create.bind(this);
        this.getAll       = this.getAll.bind(this);
        this.getById      = this.getById.bind(this);
        this.getByLevel   = this.getByLevel.bind(this);
        this.update       = this.update.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
    }

    async create(req, res) {
        try {
            const imageUrl = req.file?.path || null;
            const payload  = { ...req.body, image: imageUrl };

            const category = await this.categoryService.create(payload, req.admin?.id, req);
            return sendSuccess(res, 201, "Category created successfully.", category);
        } catch (error) {
            if (error.message === "Only image files are allowed.") {
                return sendError(res, 400, error.message);
            }
            return sendError(res, error.statusCode || 500, error.message);
        }
    }



    async getAll(req, res) {
        try {
            const { level ,fromDate,toDate} = req.query;
            const categories = await this.categoryService.getAll(level,fromDate,toDate);
            return sendSuccess(res, 200, "All categories fetched successfully.", categories);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
    
    async getById(req, res) {
        try {
            const category = await this.categoryService.getById(req.params.id);
            return sendSuccess(res, 200, "Category fetched successfully.", category);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getByLevel(req, res) {
        try {
            const { level } = req.params;
            const { page = 1, limit = 10, search = "", isActive, fromDate, toDate } = req.query;
            const { categories, total } = await this.categoryService.getByLevel(level.toUpperCase(), page, limit, search, isActive, fromDate, toDate);
            return sendSuccess(res, 200, `${level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()} categories fetched successfully.`, {
                categories,
                pagination: { total, page: parseInt(page), limit: parseInt(limit) }
            });
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }


    async update(req, res) {
        try {
            const imageUrl = req.file?.path;
            const payload  = { ...req.body, ...(imageUrl && { image: imageUrl }) };

            const category = await this.categoryService.update(req.params.id, payload, req.admin?.id, req);
            return sendSuccess(res, 200, "Category updated successfully.", category);
        } catch (error) {
            if (error.message === "Only image files are allowed.") {
                return sendError(res, 400, error.message);
            }
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleStatus(req, res) {
        try {
            const result = await this.categoryService.toggleStatus(req.params.id, req.admin?.id, req);
            return sendSuccess(res, 200, result.message, result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }


}

export default CategoryController;