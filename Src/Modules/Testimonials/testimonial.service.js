class TestimonialService {
  constructor(testimonialRepository) {
    this.testimonialRepository = testimonialRepository;
  }

  async createTestimonial(data) {
    return await this.testimonialRepository.createTestimonial(data);
  }

  async getActiveTestimonials() {
    return await this.testimonialRepository.findAllActive();
  }

  async getAllTestimonials() {
    return await this.testimonialRepository.findAll();
  }

  async updateTestimonial(id, data) {
    return await this.testimonialRepository.updateTestimonial(id, data);
  }

  async deleteTestimonial(id) {
    return await this.testimonialRepository.deleteTestimonial(id);
  }
}

export default TestimonialService;
