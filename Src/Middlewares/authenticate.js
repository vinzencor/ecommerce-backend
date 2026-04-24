import jwt from "jsonwebtoken";
import { sendError } from "../Utils/apiResponse.js";
import prisma from "../Config/prismaClient.js";
import AuthRepository from "../Modules/Auth/auth.repository.js";

const authRepo = new AuthRepository(prisma);

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;


const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;


    if (!accessToken) {
      return sendError(res, 401, "Access denied. No token provided.");
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);

    const user = await authRepo.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, "Access denied. User no longer exists.");
    }

    if (!user.is_active) {
      return sendError(res, 403, "Access denied. User account is deactivated.");
    }


    // Strip password before attaching to request
    const { password: _pwd, ...safeUser } = user;
    req.user = safeUser;

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

export default authenticate;
