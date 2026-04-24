import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class ProductController {
    constructor(productService) {
        this.productService = productService;

        this.create       = this.create.bind(this);
        this.findAll       = this.findAll.bind(this);
        this.findById      = this.findById.bind(this);
        this.update       = this.update.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.getStats     = this.getStats.bind(this);
        this.getExpiringProducts = this.getExpiringProducts.bind(this);
    }

    async create(req, res) {
        try {
            if (req.vendor && req.vendor.id) {
                req.body.vendorId = req.vendor.id;
                req.body.addedByAdmin = false;
            }
            const creatorId = req.admin?.id || req.vendor?.id;
            const product = await this.productService.create(req.body, req.files, creatorId, req);
            return sendSuccess(res, 201, "Product created successfully.", product);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findAll(req, res) {
        try {
            let { search = "", page = 1, limit = 10, categoryId = null, isActive = null, categoryActive = null, fromDate, toDate, userLat, userLng, vendorId } = req.query;
            
            if (req.vendor && req.vendor.id) {
                vendorId = req.vendor.id;
            }

            const { products, total } = await this.productService.findAll(search, page, limit, categoryId, isActive, categoryActive, fromDate, toDate, userLat, userLng, vendorId);
            
            const safeInt = (val, fallback) => {
                if (val === "" || val === null || val === undefined || val === "null" || val === "undefined") return fallback;
                const parsed = parseInt(val);
                return isNaN(parsed) ? fallback : parsed;
            };

            const p = safeInt(page, 1);
            const l = safeInt(limit, 10);

            return sendSuccess(res, 200, "Products fetched successfully.", {
                products,
                pagination: { total, page: p, limit: l }
            });
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async findById(req, res) {
        try {
            const { userLat, userLng } = req.query;
            const product = await this.productService.findById(req.params.id, userLat, userLng);
            return sendSuccess(res, 200, "Product fetched successfully.", product);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async update(req, res) {
        try {
            if (req.vendor && req.vendor.id) {
                req.body.vendorId = req.vendor.id;
            }
            const updaterId = req.admin?.id || req.vendor?.id;
            const requestVendorId = req.vendor?.id || null;
            const product = await this.productService.update(req.params.id, req.body, req.files, updaterId, req, requestVendorId);
            return sendSuccess(res, 200, "Product updated successfully.", product);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleStatus(req, res) {
        try {
            const updaterId = req.admin?.id || req.vendor?.id;
            const requestVendorId = req.vendor?.id || null;
            const product = await this.productService.toggleStatus(req.params.id, req.body.isActive, updaterId, req, requestVendorId);
            return sendSuccess(res, 200, product.message, product);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getStats(req, res) {
        try {
            const requestVendorId = req.vendor?.id || null;
            const stats = await this.productService.getStats(requestVendorId);
            return sendSuccess(res, 200, "Product stats fetched successfully.", stats);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getExpiringProducts(req, res) {
        try {
            const days = req.query.days || 30;
            const requestVendorId = req.vendor?.id || null;
            const products = await this.productService.getExpiringProducts(days, requestVendorId);
            return sendSuccess(res, 200, "Expiring products fetched successfully.", products);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default ProductController;