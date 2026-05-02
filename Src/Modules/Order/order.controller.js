import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;

    this.placeOrder = this.placeOrder.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getOrderByIdAdmin = this.getOrderByIdAdmin.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.requestReturn = this.requestReturn.bind(this);
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

  async getAllOrders(req, res) {
    try {
      const orders = await this.orderService.getAllOrders();
      return sendSuccess(res, 200, "All orders fetched successfully.", orders);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getOrderByIdAdmin(req, res) {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderByIdAdmin(id);
      return sendSuccess(res, 200, "Order details fetched successfully.", order);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(id, status);
      return sendSuccess(res, 200, "Order status updated successfully.", order);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async cancelOrder(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { reason } = req.body;
      const result = await this.orderService.cancelOrder(userId, id, reason);
      return sendSuccess(res, 200, "Order cancelled successfully.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async requestReturn(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const result = await this.orderService.requestReturn(userId, id, req.body);
      return sendSuccess(res, 200, "Return request submitted successfully.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default OrderController;
