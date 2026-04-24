import { generateCustomId } from "../../../Utils/generateCustomId.js";

class VendorAuthRepository {
    constructor(prismaClient) {
        this.db = prismaClient;
    }

    async findByEmail(email) {
        return await this.db.vendor.findUnique({ where: { email } });
    }

    async findByPhone(phone) {
        return await this.db.vendor.findUnique({ where: { phone } });
    }

    async findById(id) {
        return await this.db.vendor.findUnique({ where: { id } });
    }

    async createVendor(data) {
        return await this.db.vendor.create({
            data: {
                ...data,
                customId: generateCustomId("VEN"),
            },
        });
    }

    async updateVendor(id, data) {
        return await this.db.vendor.update({ where: { id }, data });
    }

    async saveOTP(id, otp, otp_expires_at) {
        return await this.db.vendor.update({
            where: { id },
            data: { 
                otp, 
                otp_expires_at, 
                otp_sent_at: new Date() 
            },
        });
    }

    async markVerified(id) {
        return await this.db.vendor.update({
            where: { id },
            data: {
                is_verified: true,
                otp: null,
                otp_expires_at: null,
            },
        });
    }
}

export default VendorAuthRepository;
