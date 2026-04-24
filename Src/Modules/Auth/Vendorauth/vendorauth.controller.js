import { sendResponse, sendError } from "../../../Utils/apiResponse.js";


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



class VendorAuthController {
    constructor(vendorAuthService) {
        this.vendorAuthService = vendorAuthService;
        
        this.register = this.register.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.logout = this.logout.bind(this);
        this.Vendorprofile = this.Vendorprofile.bind(this);
    }

    async register(req, res) {
        try {
            const result = await this.vendorAuthService.register(req.body);
            return sendResponse(res, 201, "Vendor registered successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode, error.message);
        }
    }

    async verifyEmail(req, res) {
        try {
            const result = await this.vendorAuthService.verifyEmail(req.body);
            return sendResponse(res, 200, "Email verified successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode, error.message);
        }
    }

    async resendOTP(req, res) {
        try {
            const result = await this.vendorAuthService.resendOTP(req.body);
            return sendResponse(res, 200, "OTP resent successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode, error.message);
        }
    }

    async login(req, res) {
        try {
            const result = await this.vendorAuthService.login(req.body);
            
            res.cookie("vendorAccessToken",result.accessToken,ACCESS_COOKIE_OPTIONS)
            res.cookie("vendorRefreshToken",result.refreshToken,REFRESH_COOKIE_OPTIONS)

            const { accessToken: at, refreshToken: rt, ...safeResult } = result;
            return sendResponse(res, 200, "Login successful.", safeResult);
        } catch (error) {
            return sendError(res, error.statusCode, error.message);
        }
    }

    async refreshToken(req, res) {
        try {
            const token = req.cookies?.vendorRefreshToken;

            if (!token) {
                return sendError(res, 401, "No refresh token found. Please log in again.");
            }

            const { accessToken, refreshToken } = await this.vendorAuthService.refreshToken(token);

            res.cookie("vendorRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
            res.cookie("vendorAccessToken", accessToken, ACCESS_COOKIE_OPTIONS);

            return sendResponse(res, 200, "Refresh token successful.", { accessToken });
        } catch (error) {
            return sendError(res, error.statusCode, error.message);
        }
    }



    async Vendorprofile(req, res) {
        try {
            const vendorId = req.vendor.id;

            if (Object.keys(req.body).length > 0 || req.files || req.file) {
                const updateData = { ...req.body };

                if (req.files) {
                    if (req.files.BusinessLogo) updateData.BusinessLogo = req.files.BusinessLogo[0].path;
                    if (req.files.IdProof) updateData.IdProof = req.files.IdProof[0].path;
                    if (req.files.pancard) updateData.pancard = req.files.pancard[0].path;
                } else if (req.file) {
                    
                    updateData.BusinessLogo = req.file.path;
                }

                const result = await this.vendorAuthService.updateVendorProfile(vendorId, updateData);
                return sendResponse(res, 200, "Vendor profile updated successfully.", result);
            }

            const result = await this.vendorAuthService.getVendorProfile(vendorId);
            return sendResponse(res, 200, "Vendor profile fetched successfully.", result);
        } catch (error) {
            return sendError(res, error.statusCode || 500, error.message);
        }
    }

    async logout(req, res) {
        try {

            res.clearCookie("vendorRefreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                partitioned: true,
            });
            res.clearCookie("vendorAccessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                partitioned: true,
            });

            return sendResponse(res, 200, "Logout successful.");
        } catch (error) {
            return sendError(res, error.statusCode, error.message);
        }
    }
}

export default VendorAuthController;