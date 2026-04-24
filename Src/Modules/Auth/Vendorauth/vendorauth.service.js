import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP, otpExpiresAt, isOTPExpired } from "../../../Utils/otpHelper.js";
import { otpEmailTemplate } from "../../../Utils/emailTemplates.js";

const SALT_ROUNDS = 10;

class VendorAuthService {
    constructor(vendorAuthRepository, sendEmail) {
        this.vendorAuthRepository = vendorAuthRepository;
        this.sendEmail = sendEmail;
    }

    async register(payload) {
        const { name, email, phone, password } = payload;

        const existingEmail = await this.vendorAuthRepository.findByEmail(email);
        if (existingEmail) {
            const err = new Error("Email is already registered.");
            err.statusCode = 409;
            throw err;
        }

        if (phone) {
            const existingPhone = await this.vendorAuthRepository.findByPhone(phone);
            if (existingPhone) {
                const err = new Error("Phone number is already registered.");
                err.statusCode = 409;
                throw err;
            }
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newVendor = await this.vendorAuthRepository.createVendor({
            name,
            email,
            phone: phone || null,
            password: hashedPassword,
        });

        const otp = generateOTP();
        const expiry = otpExpiresAt(5);
        await this.vendorAuthRepository.saveOTP(newVendor.id, otp, expiry);

        this.sendEmail({
            to: email,
            subject: "Verify your email – Ecommerce Vendor App",
            html: otpEmailTemplate(name, otp),
        }).catch((err) => console.error("Email send error:", err.message));

        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = newVendor;
        return { vendor: safeVendor };
    }

    async verifyEmail(payload) {
        const { email, otp } = payload;

        const vendor = await this.vendorAuthRepository.findByEmail(email);
        if (!vendor) {
            const err = new Error("Vendor not found.");
            err.statusCode = 404;
            throw err;
        }

        if (vendor.is_verified) {
            const err = new Error("Email is already verified.");
            err.statusCode = 400;
            throw err;
        }

        if (!vendor.otp || vendor.otp !== otp) {
            const err = new Error("Invalid OTP. Please check your email and try again.");
            err.statusCode = 400;
            throw err;
        }

        if (isOTPExpired(vendor.otp_expires_at)) {
            const err = new Error("OTP has expired. Please request a new one.");
            err.statusCode = 410;
            throw err;
        }

        await this.vendorAuthRepository.markVerified(vendor.id);

        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = vendor;
        return { vendor: { ...safeVendor, is_verified: true } };
    }

    async resendOTP(payload) {
        const { email } = payload;

        const vendor = await this.vendorAuthRepository.findByEmail(email);
        if (!vendor) {
            const err = new Error("No account found with that email.");
            err.statusCode = 404;
            throw err;
        }

        if (vendor.is_verified) {
            const err = new Error("This account is already verified.");
            err.statusCode = 400;
            throw err;
        }

        const COOLDOWN_SECONDS = 60;
        if (vendor.otp_sent_at) {
            const secondsSinceLast = Math.floor((Date.now() - new Date(vendor.otp_sent_at).getTime()) / 1000);
            if (secondsSinceLast < COOLDOWN_SECONDS) {
                const waitFor = COOLDOWN_SECONDS - secondsSinceLast;
                const err = new Error(`Please wait ${waitFor} second${waitFor !== 1 ? "s" : ""} before requesting a new code.`);
                err.statusCode = 429;
                throw err;
            }
        }

        const otp = generateOTP();
        const expiry = otpExpiresAt(10);
        await this.vendorAuthRepository.saveOTP(vendor.id, otp, expiry);

        this.sendEmail({
            to: email,
            subject: "Your new verification code – Vendor Account",
            html: otpEmailTemplate(vendor.name, otp),
        }).catch((err) => console.error("Email send error:", err.message));

        return { email };
    }

    async login(payload) {
        const { email, password } = payload;

        const vendor = await this.vendorAuthRepository.findByEmail(email);
        if (!vendor) {
            const err = new Error("Invalid email or password.");
            err.statusCode = 401;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            const err = new Error("Invalid email or password.");
            err.statusCode = 401;
            throw err;
        }

        if (!vendor.is_active) {
            const err = new Error("Access denied. Vendor account is deactivated.");
            err.statusCode = 403;
            throw err;
        }

        if (!vendor.is_verified) {
            const err = new Error("Please verify your email before logging in.");
            err.statusCode = 403;
            throw err;
        }

        const accessToken = this._signAccessToken(vendor.id);
        const refreshToken = this._signRefreshToken(vendor.id);

        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = vendor;
        return { vendor: safeVendor,accessToken,refreshToken};
    }

    async refreshToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const vendor = await this.vendorAuthRepository.findById(decoded.id);
        if (!vendor) {
            const err = new Error("Vendor not found.");
            err.statusCode = 404;
            throw err;
        }
        const accessToken = this._signAccessToken(vendor.id);
        const refreshToken = this._signRefreshToken(vendor.id);
        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = vendor;
        return { vendor: safeVendor, accessToken, refreshToken };
    }

    async getVendorProfile(vendorId) {
        const vendor = await this.vendorAuthRepository.findById(vendorId);
        if (!vendor) {
            const error = new Error("Vendor not found.");
            error.statusCode = 404;
            throw error;
        }
        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = vendor;
        return safeVendor;
    }

    async updateVendorProfile(vendorId, updateData) {
        const { id, password, otp, otp_expires_at, is_verified, ...allowedData } = updateData;
        if (allowedData.phone && !Array.isArray(allowedData.phone)) {
            allowedData.phone = [allowedData.phone];
        }

        const requiredFields = ["BusinessName", "BusinessAddress", "GSTNumber", "bankname", "bankaccountnumber"];
        const hasAllRequired = requiredFields.every(field => allowedData[field]);
        if(hasAllRequired){
            allowedData.isProfileComplete = true;
        }

        const updatedVendor = await this.vendorAuthRepository.updateVendor(vendorId, allowedData);
        
        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = updatedVendor;
        return safeVendor;
    }

    async logout(token) {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const vendor = await this.vendorAuthRepository.findById(decoded.id);
        if (!vendor) {
            const err = new Error("Vendor not found.");
            err.statusCode = 404;
            throw err;
        }
        
        return { message: "Logout successful." };
    }

    _signAccessToken(vendorId) {
        return jwt.sign(
            { id: vendorId },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );
    }

    _signRefreshToken(vendorId) {
        return jwt.sign(
            { id: vendorId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );
    }
}

export default VendorAuthService;
