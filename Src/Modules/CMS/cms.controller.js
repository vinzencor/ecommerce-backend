import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class CMSController {
  constructor(cmsService) {
    this.cmsService = cmsService;
  }

  async createPage(req, res) {
    try {
      const page = await this.cmsService.createPage(req.body);
      return sendSuccess(res, 201, "Page created successfully.", page);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getPageBySlug(req, res) {
    try {
      const { slug } = req.params;
      const page = await this.cmsService.getPageBySlug(slug);
      return sendSuccess(res, 200, "Page fetched successfully.", page);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getPageById(req, res) {
    try {
      const { id } = req.params;
      const page = await this.cmsService.getPageById(id);
      return sendSuccess(res, 200, "Page fetched successfully.", page);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }


  async getAllPages(req, res) {
    try {
      const pages = await this.cmsService.getAllPages();
      return sendSuccess(res, 200, "All pages fetched successfully.", pages);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getPublicPages(req, res) {
    try {
      const pages = await this.cmsService.getAllPages(true);
      return sendSuccess(res, 200, "Public pages fetched successfully.", pages);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }


  async updatePage(req, res) {
    try {
      const { id } = req.params;
      const page = await this.cmsService.updatePage(id, req.body);
      return sendSuccess(res, 200, "Page updated successfully.", page);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async deletePage(req, res) {
    try {
      const { id } = req.params;
      await this.cmsService.deletePage(id);
      return sendSuccess(res, 200, "Page deleted successfully.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  // FAQ Controller Methods
  async createFaq(req, res) {
    try {
      const faq = await this.cmsService.createFaq(req.body);
      return sendSuccess(res, 201, "FAQ created successfully.", faq);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getFaqById(req, res) {
    try {
      const { id } = req.params;
      const faq = await this.cmsService.getFaqById(id);
      return sendSuccess(res, 200, "FAQ fetched successfully.", faq);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllFaqs(req, res) {
    try {
      const { type } = req.query;
      const faqs = await this.cmsService.getAllFaqs(type);
      return sendSuccess(res, 200, "FAQs fetched successfully.", faqs);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateFaq(req, res) {
    try {
      const { id } = req.params;
      const faq = await this.cmsService.updateFaq(id, req.body);
      return sendSuccess(res, 200, "FAQ updated successfully.", faq);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async deleteFaq(req, res) {
    try {
      const { id } = req.params;
      await this.cmsService.deleteFaq(id);
      return sendSuccess(res, 200, "FAQ deleted successfully.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}


export default CMSController;
