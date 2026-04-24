import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class HomeController {
  constructor(homeService) {
    this.homeService = homeService;
    this.getHomeData = this.getHomeData.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.getCategoryProducts = this.getCategoryProducts.bind(this);
    this.getOfferProducts = this.getOfferProducts.bind(this);
    this.search = this.search.bind(this);
    this.filter = this.filter.bind(this);
    this.getFilterOptions = this.getFilterOptions.bind(this);
  }

  async getHomeData(req, res) {
    try {
      const data = await this.homeService.getHomeScreenData();
      return sendSuccess(res, 200, "Home data fetched successfully.", data);
    } catch (error) {
      console.log("ERROR in getHomeData:", error);
      return sendError(res, error.statusCode || 500, error.message);
    }
  }


  async getProductById(req, res) {
    try {
      const data = await this.homeService.getProductDetails(req.params.id);
      return sendSuccess(res, 200, "Product details fetched successfully.", data);
    } catch (error) {
      console.log(error)
      return sendError(res, error.statusCode || 500, error.message);
    }
  }


  

  async getCategoryProducts(req, res) {
    try {
      const data = await this.homeService.getCategoryProducts(req.params.id);
      return sendSuccess(res, 200, "Category products fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getOfferProducts(req, res) {
    try {
      const data = await this.homeService.getOfferProducts(req.params.id);
      return sendSuccess(res, 200, "Offer products fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async search(req, res) {
    try {
      const { value, page, limit } = req.query;
      const data = await this.homeService.searchProducts(value, page, limit);
      return sendSuccess(res, 200, "Search results fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async filter(req, res) {
    try {
      const data = await this.homeService.getFilteredProducts(req.query);
      return sendSuccess(res, 200, "Filtered products fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getFilterOptions(req, res) {
    try {
      const data = await this.homeService.getFilterOptions(req.params.categoryId);
      return sendSuccess(res, 200, "Filter options fetched successfully.", data);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default HomeController;
