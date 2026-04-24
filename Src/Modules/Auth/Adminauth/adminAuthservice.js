import jwt from "jsonwebtoken";
import { comparePassword } from "../../../Utils/bcrypt.js";

class AdminAuthService {
    constructor(adminAuthRepository) {
        this.adminAuthRepository = adminAuthRepository;
    }

    async login({ email, password }) {
        const admin = await this.adminAuthRepository.findByEmail(email);
        if (!admin) {
            const err = new Error("Invalid credentials.");
            err.statusCode = 401;
            throw err;
        }

        if (!admin.is_active) {
            const err = new Error("Admin account is deactivated.");
            err.statusCode = 403;
            throw err;
        }

        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            const err = new Error("Invalid credentials.");
            err.statusCode = 401;
            throw err;
        }

        await this.adminAuthRepository.updateLastLogin(admin.id);

        const accessToken  = this._signAccessToken(admin.id);
        const refreshToken = this._signRefreshToken(admin.id);

        return {
            accessToken,
            refreshToken,
            admin: {
                id:    admin.id,
                name:  admin.name,
                email: admin.email,
                role:  admin.role,
            },
        };
    }

    async refreshToken(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch {
            const err = new Error("Invalid or expired refresh token.");
            err.statusCode = 401;
            throw err;
        }

        const admin = await this.adminAuthRepository.findById(decoded.id);
        if (!admin) {
            const err = new Error("Admin not found.");
            err.statusCode = 404;
            throw err;
        }

        const accessToken  = this._signAccessToken(admin.id);
        const refreshToken = this._signRefreshToken(admin.id);
        return { accessToken, refreshToken };
    }

    async logout() {
        return { message: "Logout successful." };
    }

    _signAccessToken(adminId) {
        return jwt.sign(
            { id: adminId },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN  }
        );
    }

    _signRefreshToken(adminId) {
        return jwt.sign(
            { id: adminId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN  }
        );
    }
}

export default AdminAuthService;