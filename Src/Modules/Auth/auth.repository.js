import prisma from "../../Config/prismaClient.js";
import { generateCustomId } from "../../Utils/generateCustomId.js";

class AuthRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findByEmail(email) {
    return await this.db.users.findUnique({ where: { email } });
  }

  async findByPhone(phone) {
    return await this.db.users.findUnique({ where: { phone } });
  }
// hi
  async findByIdentifier(identifier) {
    return await this.db.users.findFirst({
        where: {
            OR: [
                { email: identifier },
                { phone: identifier }
            ]
        }
    });
  }

  async findById(id) {
    return await this.db.users.findUnique({ 
      where: { id },
      include: {
        addresses: true
      }
    });
  }

  async findByReferralCode(referralCode) {
    return await this.db.users.findUnique({ where: { referralCode } });
  }

  async checkReferralHistory(email, phone) {
    const filters = [];
    if (email) filters.push({ email });
    if (phone) filters.push({ phone });
    
    if (filters.length === 0) return null;

    return await this.db.referralHistory.findFirst({
        where: {
            OR: filters
        }
    });
  }

  async addReferralHistory(email, phone) {
      return await this.db.referralHistory.create({
          data: { 
            email: email || null, 
            phone: phone || null 
          }
      });
  }

  async updateCoins(id, coins) {
      return await this.db.users.update({
          where: { id },
          data: {
              coins: {
                  increment: coins
              }
          }
      });
  }

  async createUser(data) {
    return await this.db.users.create({
      data: {
        ...data,
        customId: generateCustomId("USR"),
      },
    });
  }




  async updateProfile(id, data) {
    return await this.db.users.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async saveOTP(id, otp, otp_expires_at) {
    return await this.db.users.update({
      where: { id },
      data: { otp, otp_expires_at, otp_sent_at: new Date() },
    });
  }

  async markVerified(id) {
    return await this.db.users.update({
      where: { id },
      data: {
        is_verified: true,
        otp: null,
        otp_expires_at: null,
      },
    });
  }

  // ADDRESS 

  async createAddress(data) {
    return await this.db.address.create({ data });
  }

  async findAddressById(id) {
    return await this.db.address.findUnique({ where: { id } });
  }

  async findAddressesByUserId(userId) {
    return await this.db.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  async countAddresses(userId) {
    return await this.db.address.count({ where: { userId } });
  }

  async updateAddress(id, userId, data) {
    return await this.db.address.update({
      where: { id, userId },
      data
    });
  }

  async deleteAddress(id, userId) {
    return await this.db.address.delete({
      where: { id, userId }
    });
  }

  async unsetDefaultAddress(userId) { 
    return await this.db.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  async setDefaultAddress(id, userId, status = true) {
    if (status === true) {
      await this.unsetDefaultAddress(userId);
    }
    return await this.db.address.update({
      where: { id, userId },
      data: { isDefault: status }
    });
  }
}

export default AuthRepository;

