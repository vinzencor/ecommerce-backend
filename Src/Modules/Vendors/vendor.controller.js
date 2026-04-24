import { sendResponse, sendError } from "../../Utils/apiResponse.js";

class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;

        this.getVendors = this.getVendors.bind(this);
        this.getVendorById = this.getVendorById.bind(this);
        this.getVendorStats = this.getVendorStats.bind(this);
        this.updateVendorStatus = this.updateVendorStatus.bind(this);
        this.updateVendor = this.updateVendor.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.createVendor = this.createVendor.bind(this);
        this.setupPassword = this.setupPassword.bind(this);
    }


    async createVendor(req, res) {
        const files = req.files;
        const adminId = req.admin?.id;
        try {
            const result = await this.vendorService.createVendor(req.body, files, adminId, req);
            return sendResponse(res, 200, "Vendor created successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async setupPassword(req, res) {
        const { token, password } = req.body;
        try {
            if (!token || !password) {
                const error = new Error("Token and password are required.");
                error.statusCode = 400;
                throw error;
            }
            const result = await this.vendorService.setupPassword(token, password);
            return sendResponse(res, 200, result.message, null);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getVendors(req, res) {
        try {
            const result = await this.vendorService.getVendors(req.query);
            return sendResponse(res, 200, "Vendors fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getVendorById(req, res) {
        try {
            const { id } = req.params;
            const result = await this.vendorService.getVendorById(id);
            return sendResponse(res, 200, "Vendor details fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getVendorStats(req, res) {
        try {
            const result = await this.vendorService.getVendorStats();
            console.log(result,"result");
            
            return sendResponse(res, 200, "Vendor stats fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async updateVendor(req, res) {
        try {
            const { id } = req.params;
            const files = req.files;
            const adminId = req.admin?.id;
            const result = await this.vendorService.updateVendor(id, req.body, files, adminId, req);
            return sendResponse(res, 200, "Vendor updated successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async updateVendorStatus(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.admin?.id;
            const result = await this.vendorService.updateVendorStatus(id, req.body, adminId, req);

            const isActive = req.body.is_active === true || req.body.is_active === "true";
            const message = isActive
                ? "Vendor has been activated successfully."
                : "Vendor has been deactivated successfully.";

            return sendResponse(res, 200, message, { is_active: result.is_active ,name:result.name});
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleFavourite(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.admin?.id;
            const result = await this.vendorService.toggleFavourite(id, adminId, req);
            return sendResponse(res, 200, "Vendor favourite status toggled successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

}

export default VendorController;
