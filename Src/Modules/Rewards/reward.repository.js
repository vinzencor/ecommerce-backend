class RewardRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async createReward(data) {
    return await this.db.userReward.create({
      data,
      include: { user: { select: { name: true, email: true } } }
    });
  }

  async findByUserId(userId) {
    return await this.db.userReward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll() {
    return await this.db.userReward.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default RewardRepository;
