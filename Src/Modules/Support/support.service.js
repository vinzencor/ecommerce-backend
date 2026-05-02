class SupportService {
  constructor(supportRepository) {
    this.supportRepository = supportRepository;
  }

  async createTicket(userId, data) {
    return await this.supportRepository.createTicket({
      userId,
      ...data
    });
  }

  async getUserTickets(userId) {
    return await this.supportRepository.findByUserId(userId);
  }

  async getTicketDetails(ticketId) {
    return await this.supportRepository.findById(ticketId);
  }

  async getAllTickets() {
    return await this.supportRepository.findAll();
  }

  async updateTicketStatus(ticketId, status) {
    return await this.supportRepository.updateStatus(ticketId, status);
  }

  async addReply(ticketId, userId, adminId, message) {
    return await this.supportRepository.addReply({
      ticketId,
      userId,
      adminId,
      message
    });
  }
}

export default SupportService;
