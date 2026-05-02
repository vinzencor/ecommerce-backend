class CMSService {
  constructor(cmsRepository) {
    this.cmsRepository = cmsRepository;
  }

  async createPage(data) {
    return await this.cmsRepository.createPage(data);
  }

  async getPageBySlug(slug) {
    const page = await this.cmsRepository.findBySlug(slug);
    if (!page) {
      const error = new Error("Page not found");
      error.statusCode = 404;
      throw error;
    }
    return page;
  }

  async getPageById(id) {
    const page = await this.cmsRepository.findById(id);
    if (!page) {
      const error = new Error("Page not found");
      error.statusCode = 404;
      throw error;
    }
    return page;
  }


  async getAllPages(isActive = false) {
    return await this.cmsRepository.findAll(isActive);
  }


  async updatePage(id, data) {
    return await this.cmsRepository.updatePage(id, data);
  }

  async deletePage(id) {
    return await this.cmsRepository.deletePage(id);
  }

  // FAQ Methods
  async createFaq(data) {
    return await this.cmsRepository.createFaq(data);
  }

  async getFaqById(id) {
    return await this.cmsRepository.findFaqById(id);
  }

  async getAllFaqs(type) {
    return await this.cmsRepository.findAllFaqs(type);
  }

  async updateFaq(id, data) {
    return await this.cmsRepository.updateFaq(id, data);
  }

  async deleteFaq(id) {
    return await this.cmsRepository.deleteFaq(id);
  }
}


export default CMSService;
