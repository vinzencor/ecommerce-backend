import { sendSuccess, sendError } from "../../Utils/apiResponse.js";




class AuthController {

  
  constructor(authService) {
    this.authService = authService;
    this.register      = this.register.bind(this);
    this.verifyEmail   = this.verifyEmail.bind(this);
    this.resendOTP     = this.resendOTP.bind(this);
    this.login         = this.login.bind(this);
    this.refreshToken  = this.refreshToken.bind(this);
    this.logout        = this.logout.bind(this);
    this.getProfile    = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.addNewAddress = this.addNewAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.getAddresses  = this.getAddresses.bind(this);
    this.makeAddressDefault = this.makeAddressDefault.bind(this);
  }

  async register(req, res) {
    try {
      const { name, email, phone, referralCode } = req.body;
      const result = await this.authService.register({ name, email, phone, referralCode });
      return sendSuccess(res, 201, "Registration successful! A verification code has been sent to your email or phone number.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async verifyEmail(req, res) {
    try {
      const { email, phone, otp } = req.body;
      const result = await this.authService.verifyEmail({ email, phone, otp });

      return sendSuccess(res, 200, "Verification successful! You are now logged in.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async resendOTP(req, res) {
    try {
      const { email, phone } = req.body;
      await this.authService.resendOTP({ email, phone });
      return sendSuccess(res, 200, "A new verification code has been sent to your email or phone number.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }


  
  async login(req, res) {
    try {
      const { email, phone } = req.body;
      const result = await this.authService.login({ email, phone });
      return sendSuccess(res, 200, result.message, { identifier: result.identifier });
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }
  



async refreshToken(req,res){
  try {
    const refreshToken = req.cookies?.userRefreshToken || req.body.refreshToken || req.headers["x-refresh-token"];
    
    if (!refreshToken) {
      return sendError(res, 401, "No refresh token provided.");
    }

    const result = await this.authService.refreshToken(refreshToken);
    return sendSuccess(res, 200, "Token refreshed successfully", result);
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message);
  }
}


async getProfile(req,res){
  try {
    const userId=req.user.id;
    const result= await this.authService.getProfile(userId);
    return sendSuccess(res,200,"Profile fetched successfully",result)
  } catch (error) {
    return sendError(res,error.statusCode||500,error.message)
  }
}





async updateProfile(req,res){
  try {
    const userId = req.user.id;
    const { name, gender, email, phone } = req.body;
    const image = req.file?.path; 
    
    // Create an update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (gender !== undefined) updateData.gender = gender;
    if (image !== undefined) updateData.image = image;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const result = await this.authService.updateProfile(userId, updateData);
    return sendSuccess(res, 200, "Profile updated successfully", result)
  } catch (error) {
    console.error("DEBUG: updateProfile Error:", error);
    return sendError(res, error.statusCode || 500, error.message)
  }
}


  async logout(req,res){
    try {
      return sendSuccess(res,200,"Logout successful")
    } catch (error) {
      return sendError(res,error.statusCode||500,error.message)
    }
  }

  async addNewAddress(req, res) {
    try {
      const userId = req.user.id;
      const address = await this.authService.addAddress(userId, req.body);
      return sendSuccess(res, 201, "Address added successfully.", address);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async updateAddress(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      console.log( id);
      const address = await this.authService.updateAddress(userId, id, req.body);
      return sendSuccess(res, 200, "Address updated successfully.", address);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async deleteAddress(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await this.authService.removeAddress(userId, id);
      return sendSuccess(res, 200, "Address deleted successfully.");
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  
  async getAddresses(req, res) {
    try {
      const userId = req.user.id;
      const addresses = await this.authService.getAddresses(userId);
      return sendSuccess(res, 200, "Addresses fetched successfully.", addresses);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }

  async makeAddressDefault(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { isDefault } = req.body;
      const result = await this.authService.makeAddressDefault(userId, id, isDefault);
      return sendSuccess(res, 200, result.isDefault ? "Address set as default." : "Address unset from default.", result);
    } catch (error) {
      return sendError(res, error.statusCode || 500, error.message);
    }
  }




}

export default AuthController;
