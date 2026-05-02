class CMSRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createPage(data) {
    return await this.db.cMS.create({ data });
  }

  async findBySlug(slug) {
    // Handle both cases: with and without leading slash
    const formattedSlug = slug.startsWith('/') ? slug : `/${slug}`;
    return await this.db.cMS.findFirst({
      where: {
        OR: [
          { slug: slug, isActive: true },
          { slug: formattedSlug, isActive: true }
        ]
      }
    });
  }

  async findById(id) {
    return await this.db.cMS.findUnique({
      where: { id }
    });
  }




  async findAll(isActive = false) {
    const where = isActive ? { isActive: true } : {};
    return await this.db.cMS.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }


  async updatePage(id, data) {
    return await this.db.cMS.update({
      where: { id },
      data
    });
  }

  async deletePage(id) {
    return await this.db.cMS.delete({
      where: { id }
    });
  }

  // FAQ Methods
  async createFaq(data) {
    return await this.db.fAQ.create({ data });
  }

  async findFaqById(id) {
    return await this.db.fAQ.findUnique({ where: { id } });
  }

  async findAllFaqs(type) {
    const where = type ? { type } : {};
    return await this.db.fAQ.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
  }

  async updateFaq(id, data) {
    return await this.db.fAQ.update({
      where: { id },
      data
    });
  }

  async deleteFaq(id) {
    return await this.db.fAQ.delete({ where: { id } });
  }
}


export default CMSRepository;
