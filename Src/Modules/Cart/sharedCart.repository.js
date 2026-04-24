import prisma from "../../Config/prismaClient.js";

class SharedCartRepository {
  async create(data) {
    return await prisma.sharedCart.create({
      data: {
        items: data,
      },
    });
  }

  async findById(id) {
    return await prisma.sharedCart.findUnique({
      where: { id },
    });
  }
}

export default SharedCartRepository;
