class SupportRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createTicket(data) {
    return await this.db.supportTicket.create({
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findByUserId(userId) {
    return await this.db.supportTicket.findMany({
      where: { userId },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(ticketId) {
    return await this.db.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        replies: {
          include: {
            user: { select: { name: true } },
            admin: { select: { name: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async findAll() {
    return await this.db.supportTicket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(ticketId, status) {
    return await this.db.supportTicket.update({
      where: { id: ticketId },
      data: { status }
    });
  }

  async addReply(data) {
    return await this.db.supportReply.create({
      data,
      include: {
        user: { select: { name: true } },
        admin: { select: { name: true } }
      }
    });
  }
}

export default SupportRepository;
