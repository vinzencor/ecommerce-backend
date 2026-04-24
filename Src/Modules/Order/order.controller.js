import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async placeOrder(req, res) {
    try {
      const userId = req.user.id;
      const order = await this.orderService.placeOrder(userId, req.body);
      return sendSuccess(res, 201, "Order placed successfully.", order);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getMyOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await this.orderService.getUserOrders(userId);
      return sendSuccess(res, 200, "Orders fetched successfully.", orders);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getOrderById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const order = await this.orderService.getOrderDetail(userId, id);
      return sendSuccess(res, 200, "Order details fetched successfully.", order);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default OrderController;
