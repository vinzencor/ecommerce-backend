import jwt from "jsonwebtoken";
import { sendError } from "../Utils/apiResponse.js";
import adminAuthcontainer from "../Modules/Auth/Adminauth/adminAuthcontainer.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const { adminAuthRepository } = adminAuthcontainer;

const adminAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.cookies.adminAccessToken;

        if (!authHeader) {
            return sendError(res, 401, "Access denied. No token provided.");
        }

        const decoded = jwt.verify(authHeader, JWT_ACCESS_SECRET);

        const admin = await adminAuthRepository.findById(decoded.id);
        if (!admin) {
            return sendError(res, 401, "Access denied. Admin account no longer exists.");
        }

        if (!admin.is_active) {
            return sendError(res, 403, "Access denied. Admin account is deactivated.");
        }

        // Attach safe admin data to request
        const { password: _pwd, ...safeAdmin } = admin;
        req.admin = safeAdmin;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return sendError(res, 401, "Token has expired. Please log in again.");
        }
        if (error.name === "JsonWebTokenError") {
            return sendError(res, 401, "Invalid token.");
        }
        return sendError(res, 500, "Authentication error.");
    }
};

export default adminAuthenticate;
