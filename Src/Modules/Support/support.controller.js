import { sendSuccess, sendError } from "../../Utils/apiResponse.js";

class SupportController {
  constructor(supportService) {
    this.supportService = supportService;
  }

  async createTicket(req, res) {
    try {
      const userId = req.user.id;
      const ticket = await this.supportService.createTicket(userId, req.body);
      return sendSuccess(res, 201, "Support ticket created successfully.", ticket);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getMyTickets(req, res) {
    try {
      const userId = req.user.id;
      const tickets = await this.supportService.getUserTickets(userId);
      return sendSuccess(res, 200, "Support tickets fetched successfully.", tickets);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getTicketDetails(req, res) {
    try {
      const { id } = req.params;
      const ticket = await this.supportService.getTicketDetails(id);
      return sendSuccess(res, 200, "Ticket details fetched successfully.", ticket);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await this.supportService.getAllTickets();
      return sendSuccess(res, 200, "All support tickets fetched successfully.", tickets);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ticket = await this.supportService.updateTicketStatus(id, status);
      return sendSuccess(res, 200, "Ticket status updated successfully.", ticket);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async replyToTicket(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user.role === 'user' ? req.user.id : null;
      const adminId = req.user.role === 'admin' ? req.user.id : null;
      
      const reply = await this.supportService.addReply(id, userId, adminId, message);
      return sendSuccess(res, 201, "Reply added successfully.", reply);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default SupportController;
