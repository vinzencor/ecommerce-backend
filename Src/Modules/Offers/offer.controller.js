import { sendError, sendSuccess } from "../../Utils/apiResponse.js";

class OfferController {
    constructor(offerService) {
        
        this.offerService = offerService;
        this.createOffer = this.createOffer.bind(this);
        this.getAllOffers = this.getAllOffers.bind(this);
        this.getOfferById = this.getOfferById.bind(this);
        this.updateOffer = this.updateOffer.bind(this);
        this.deleteOffer = this.deleteOffer.bind(this);
        this.toggleOfferStatus = this.toggleOfferStatus.bind(this);
    }

    async createOffer(req, res) {
        try {
            const offer = await this.offerService.create(req.body, req.admin?.id, req);
            return sendSuccess(res, 201, "Offer created successfully.", offer);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getAllOffers(req, res) {
        try {
            const { search, isActive, fromDate, toDate, page, limit } = req.query;
            const result = await this.offerService.getAll({ search, isActive, fromDate, toDate, page, limit });
            return sendSuccess(res, 200, "Offers fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async getOfferById(req, res) {
        try {
            const offer = await this.offerService.getById(req.params.id);
            return sendSuccess(res, 200, "Offer fetched successfully.", offer);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async updateOffer(req, res) {
        try {
            const offer = await this.offerService.update(req.params.id, req.body, req.admin?.id, req);
            return sendSuccess(res, 200, "Offer updated successfully.", offer);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async deleteOffer(req, res) {
        try {
            const offer = await this.offerService.delete(req.params.id, req.admin?.id, req);
            return sendSuccess(res, 200, "Offer deleted successfully.", offer);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async toggleOfferStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            const offer = await this.offerService.toggleStatus(id, isActive, req.admin?.id, req);
            return sendSuccess(res, 200, `Offer ${offer.isActive ? "activated" : "deactivated"} successfully.`, offer);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
    
}

export default OfferController;
