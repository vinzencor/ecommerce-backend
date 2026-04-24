import { sendSuccess, sendError } from "../../../Utils/apiResponse.js";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, 
    sameSite: "none",
    partitioned: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, 
    sameSite: "none",
    partitioned: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

class AdminAuthController {
    constructor(adminAuthService) {
        this.adminAuthService = adminAuthService;
        this.login        = this.login.bind(this);
        this.logout       = this.logout.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.adminAuthService.login({ email, password });

            res.cookie("adminAccessToken", result.accessToken, ACCESS_COOKIE_OPTIONS);
            res.cookie("adminRefreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

            return sendSuccess(res, 200, "Login successful.", {
                admin: result.admin,
            });
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async refreshToken(req, res) {
        try {
            const token = req.cookies?.adminRefreshToken;

            if (!token) {
                return sendError(res, 401, "No refresh token found. Please log in again.");
            }

            const { accessToken, refreshToken } = await this.adminAuthService.refreshToken(token);

            res.cookie("adminRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
            res.cookie("adminAccessToken", accessToken, ACCESS_COOKIE_OPTIONS);

            return sendSuccess(res, 200, "Token refreshed successfully.", { accessToken });
        } catch (error) {
            return sendError(res, error.statusCode || 401, error.message);
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("adminRefreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                partitioned: true,
            });
            res.clearCookie("adminAccessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                partitioned: true,
            });
            return sendSuccess(res, 200, "Logged out successfully.");
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default AdminAuthController;
