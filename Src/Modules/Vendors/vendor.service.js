import bcrypt from "bcrypt";
import { vendorApprovalTemplate, vendorRejectionTemplate, vendorSetupTemplate } from "../../Utils/emailTemplates.js";
import crypto from "crypto";
const SALT_ROUNDS = 10;

class VendorService {
    constructor(vendorRepository, sendEmail, adminAuditLogService) {
        this.vendorRepository = vendorRepository;
        this.sendEmail = sendEmail;
        this.adminAuditLogService = adminAuditLogService;
    }

    async createVendor(data, files, adminId = null, req = null) {
        const payload = { ...data };
        
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
        }

        payload.isApproved = 'APPROVED';
        payload.is_active = true;
        payload.isProfileComplete = true;
        payload.createdByAdmin = true;

        if (payload.createdByAdmin) {
            payload.setupToken = crypto.randomBytes(32).toString('hex');
            payload.setupTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        

        const vendor = await this.vendorRepository.create(payload, files);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "CREATE",
                "Vendor",
                vendor.id,
                null,
                vendor,
                req
            );
        }

        // Send setup email to vendor
        if (vendor.setupToken) {
            const setupUrl = `${process.env.CLIENT_URL_PROD}/vendor/setup-password?token=${vendor.setupToken}`;
            this.sendEmail({
                to: vendor.email,
                subject: "Set up your Vendor Account - Ecommerce Marketplace",
                html: vendorSetupTemplate(vendor.name, setupUrl),
            }).catch(err => console.error("Setup email failed:", err.message));
        }

        return vendor;
    }

    async setupPassword(token, password) {
        const vendor = await this.vendorRepository.findBySetupToken(token);
        if (!vendor) {
            const error = new Error("Invalid or expired setup token.");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await this.vendorRepository.completeSetup(vendor.id, hashedPassword);

        return { message: "Account setup successful. You can now login." };
    }

    async getVendors(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await this.vendorRepository.findAll({
            skip,
            take: limit,
            search: query.search,
            isApproved: query.isApproved || query.is_approved || undefined,
            isActive: (query.isActive || query.is_active) ? ((query.isActive || query.is_active) === "true") : undefined,
            isFavourite: (query.isFavourite || query.is_favourite) ? ((query.isFavourite || query.is_favourite) === "true") : undefined,
            fromDate: query.fromDate || query.startDate || undefined,
            toDate: query.toDate || query.endDate || undefined,
        });

        return {
            vendors: (result.vendors || []).map((v) => {
                const { password, ...safeVendor } = v;  
                return safeVendor;
            }),
            pagination: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }


    async getVendorStats() {
        const result = await this.vendorRepository.getVendorStats();
        return result;
    }

    async getVendorById(id) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            const error = new Error("Vendor not found.");
            error.statusCode = 404;
            throw error;
        }
        const { password, ...safeVendor } = vendor;
        return safeVendor;
    }



    async updateVendor(id, updateData, files, adminId = null, req = null) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            const error = new Error("Vendor not found.");
            error.statusCode = 404;
            throw error;
        }

        const oldStatus = vendor.isApproved;
        const updatedVendor = await this.vendorRepository.update(id, updateData, files);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "Vendor",
                id,
                vendor,
                updatedVendor,
                req
            );
        }

        if (updatedVendor.isApproved !== oldStatus) {
            this._sendApprovalEmail(updatedVendor, updateData.rejectionReason);
        }

        const { password, ...safeVendor } = updatedVendor;
        return safeVendor;
    }

    async updateVendorStatus(id, updateData, adminId = null, req = null) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            const error = new Error("Vendor not found.");
            error.statusCode = 404;
            throw error;
        }

        if (updateData.isApproved === "APPROVED") {
            const REQUIRED_PROFILE_FIELDS = [
                "BusinessName",
                "BusinessLogo",
                "BusinessAddress",
                "GSTNumber",
                "IdProof",
                "bankname",
                "bankaccountnumber",
                "bankifscode",
                "pancard",
                "latitude",
                "longitude",
                "deliveryRadius"
            ];

            const missingFields = REQUIRED_PROFILE_FIELDS.filter(
                (field) => !vendor[field] || vendor[field].toString().trim() === ""
            );

            if (missingFields.length > 0) {
                const error = new Error(
                    `Cannot approve vendor. The following profile fields are incomplete: ${missingFields.join(", ")}`
                );
                error.statusCode = 400;
                throw error;
            }

            updateData.isProfileComplete = true;
        }

        const oldStatus = vendor.isApproved;
        const updatedVendor = await this.vendorRepository.update(id, updateData);

        if (adminId && this.adminAuditLogService) {
            const action = updateData.isApproved ? "UPDATE_STATUS" : "TOGGLE_ACTIVE";
            await this.adminAuditLogService.log(
                adminId,
                action,
                "Vendor",
                id,
                vendor,
                updatedVendor,
                req
            );
        }

        if (updatedVendor.isApproved !== oldStatus) {
            this._sendApprovalEmail(updatedVendor, updateData.rejectionReason);
        }

        const { password, ...safeVendor } = updatedVendor;
        return safeVendor;
    }

    async toggleFavourite(id, adminId = null, req = null) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            const error = new Error("Vendor not found.");
            error.statusCode = 404;
            throw error;
        }

        const updatedVendor = await this.vendorRepository.update(id, {
            isFavourite: !vendor.isFavourite
        });

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_FAVOURITE",
                "Vendor",
                id,
                { isFavourite: vendor.isFavourite },
                { isFavourite: updatedVendor.isFavourite },
                req
            );
        }

        const { password, ...safeVendor } = updatedVendor;
        return safeVendor;
    }

    async _sendApprovalEmail(vendor, reason) {
        try {
            let html = "";
            let subject = "";

            if (vendor.isApproved === "APPROVED") {
                subject = "Your Vendor Account has been Approved!";
                html = vendorApprovalTemplate(vendor.name);
            } else if (vendor.isApproved === "REJECTED") {
                subject = "Update regarding your Vendor Account Application";
                html = vendorRejectionTemplate(vendor.name, reason);
            }

            if (html && subject) {
                await this.sendEmail({
                    to: vendor.email,
                    subject,
                    html
                });
            }
        } catch (error) {
            console.error("Email notification failed:", error.message);
        }
    }
}

export default VendorService;
