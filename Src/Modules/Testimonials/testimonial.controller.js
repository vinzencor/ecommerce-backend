import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class TestimonialController {
  constructor(testimonialService) {
    this.testimonialService = testimonialService;
  }

  async createTestimonial(req, res) {
    try {
      const testimonial = await this.testimonialService.createTestimonial(req.body);
      return sendSuccess(res, 201, "Testimonial created successfully.", testimonial);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getActiveTestimonials(req, res) {
    try {
      const testimonials = await this.testimonialService.getActiveTestimonials();
      return sendSuccess(res, 200, "Testimonials fetched successfully.", testimonials);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllTestimonials(req, res) {
    try {
      const testimonials = await this.testimonialService.getAllTestimonials();
      return sendSuccess(res, 200, "All testimonials fetched successfully.", testimonials);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateTestimonial(req, res) {
    try {
      const { id } = req.params;
      const testimonial = await this.testimonialService.updateTestimonial(id, req.body);
      return sendSuccess(res, 200, "Testimonial updated successfully.", testimonial);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async deleteTestimonial(req, res) {
    try {
      const { id } = req.params;
      await this.testimonialService.deleteTestimonial(id);
      return sendSuccess(res, 200, "Testimonial deleted successfully.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default TestimonialController;
