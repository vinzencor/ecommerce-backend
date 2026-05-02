class TestimonialRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createTestimonial(data) {
    return await this.db.testimonial.create({ data });
  }

  async findAllActive() {
    return await this.db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll() {
    return await this.db.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateTestimonial(id, data) {
    return await this.db.testimonial.update({
      where: { id },
      data
    });
  }

  async deleteTestimonial(id) {
    return await this.db.testimonial.delete({
      where: { id }
    });
  }
}

export default TestimonialRepository;
