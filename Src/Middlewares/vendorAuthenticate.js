import jwt from "jsonwebtoken";
import { sendError } from "../Utils/apiResponse.js";
import vendorAuthContainer from "../Modules/Auth/Vendorauth/vendorauth.container.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const { vendorAuthRepository } = vendorAuthContainer;

const vendorAuthenticate = async (req, res, next) => {
    try {
        const auth = req.cookies?.vendorAccessToken;

        if (!auth) {
            return sendError(res, 401, "Access denied. No token provided.");
        }

        const decoded = jwt.verify(auth, JWT_ACCESS_SECRET);

        const vendor = await vendorAuthRepository.findById(decoded.id);
        if (!vendor) {
            return sendError(res, 401, "Access denied. Vendor no longer exists.");
        }

        if(!vendor.is_active){
            return sendError(res, 401, "Access denied. Vendor is not active.");
        }

        // Strip password before attaching to request
        const { password: _pwd, otp: _otp, otp_expires_at: _exp, ...safeVendor } = vendor;
        req.vendor = safeVendor;

        next();
    } catch (error) {
        console.error("Authentication Error Details:", error);
        if (error.name === "TokenExpiredError") {
            return sendError(res, 401, "Token has expired. Please log in again.");
        }
        if (error.name === "JsonWebTokenError") {
            return sendError(res, 401, "Invalid token.");
        }
        return sendError(res, 500, "Authentication error.");
    }
};

export default vendorAuthenticate;