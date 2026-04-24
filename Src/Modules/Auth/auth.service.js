import jwt from "jsonwebtoken";
import { generateOTP, otpExpiresAt, isOTPExpired } from "../../Utils/otpHelper.js";
import { otpEmailTemplate } from "../../Utils/emailTemplates.js";

const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;

class AuthService {

  constructor(authRepository, sendEmail, sendSMS) {
    this.authRepository = authRepository;
    this.sendEmail = sendEmail;
    this.sendSMS = sendSMS;
  }
 

  async register(payload) {
    const { name, email, phone, referralCode: providedReferralCode } = payload;
    if (!email && !phone) {
      const err = new Error("Either email or phone number is required.");
      err.statusCode = 400;
      throw err;
    }

    if (email) {
      const existingEmail = await this.authRepository.findByEmail(email);
      if (existingEmail) {
        const err = new Error("Email is already registered.");
        err.statusCode = 409;
        throw err;
      }
    }

    if (phone) {
      const existingPhone = await this.authRepository.findByPhone(phone);
      if (existingPhone) {
        const err = new Error("Phone number is already registered.");
        err.statusCode = 409;
        throw err;
      }
    }

    const generateCode = (name) => {
        const prefix = name.substring(0, 4).toUpperCase().replace(/\s/g, '');
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `${prefix}-${random}`;
    };
    const myReferralCode = generateCode(name);

    let referredByUserId = null;
    let initialCoins = 0;

    const isReturningUser = await this.authRepository.checkReferralHistory(email, phone);

    if (providedReferralCode && !isReturningUser) {
        const referrer = await this.authRepository.findByReferralCode(providedReferralCode);
        if (referrer) {
            referredByUserId = referrer.id;
            const referrerReward = 50;
            initialCoins = 20;
            await this.authRepository.updateCoins(referrer.id, referrerReward);
        }
    }


    const newUser = await this.authRepository.createUser({
      name,
      email,
      phone: phone || null,
      referralCode: myReferralCode,
      referredById: referredByUserId,
      coins: initialCoins
    });

    await this.authRepository.addReferralHistory(email, phone);

    const otp = generateOTP();
    const expiry = otpExpiresAt(5);
    await this.authRepository.saveOTP(newUser.id, otp, expiry);

    if (email) {
        this.sendEmail({
          to: email,
          subject: "Verify your account – Ecommerce App",
          html: otpEmailTemplate(name, otp),
        }).catch((err) => console.error("Email send error:", err.message));
    } else if (phone) {
        this.sendSMS(phone, otp).catch((err) => console.error("SMS send error:", err.message));
    }

    const { otp: _otp, otp_expires_at: _exp, ...safeUser } = newUser;
    return { user: { ...safeUser, myReferralCode } };
  }

 
  async verifyEmail(payload) {
    const { email, phone, otp } = payload;
    const identifier = email || phone;

    const user = await this.authRepository.findByIdentifier(identifier);
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }



    const dbOtp = String(user.otp || '').trim();
    const inputOtp = String(otp || '').trim();

    if (!dbOtp || dbOtp !== inputOtp) {
      const err = new Error("Invalid OTP. Please check your email.");
      err.statusCode = 400;
      throw err;
    }

    if (isOTPExpired(user.otp_expires_at)) {
      const err = new Error("OTP has expired.");
      err.statusCode = 410;
      throw err;
    }

    await this.authRepository.markVerified(user.id);

    // AUTO LOGIN AFTER VERIFICATION
    const accessToken = this._signAccessToken(user.id);
    const refreshToken = this._signRefreshToken(user.id);

    const { otp: _otp, otp_expires_at: _exp, ...safeUser } = user;
    return { user: { ...safeUser, is_verified: true }, accessToken, refreshToken };
  }


  async login(payload) {
    const { email, phone } = payload;
    const identifier = email || phone;

    if (!identifier) {
       const err = new Error("Email or phone number is required.");
       err.statusCode = 400;
       throw err;
    }

    const user = await this.authRepository.findByIdentifier(identifier);
    if (!user) {
      const err = new Error("No account found with this email or phone number. Please register first.");
      err.statusCode = 404;
      throw err;
    }

    if (!user.is_active) {
      const err = new Error("Access denied. Your account is deactivated.");
      err.statusCode = 403;
      throw err;
    }

    const otp = generateOTP();
    const expiry = otpExpiresAt(10);
    await this.authRepository.saveOTP(user.id, otp, expiry);

    if (user.email) {
      this.sendEmail({
        to: user.email,
        subject: "Your Login Code – Ecommerce",
        html: otpEmailTemplate(user.name, otp),
      }).catch((err) => console.error("Email send error:", err.message));
    } else if (user.phone) {
        this.sendSMS(user.phone, otp).catch((err) => console.error("SMS send error:", err.message));
    }

    return { message: "OTP sent to your email or phone number. Please verify to login.", identifier };
  }


  async refreshToken(RefreshToken){
    try {
      const decoded=jwt.verify(RefreshToken,process.env.JWT_REFRESH_SECRET);
      console.log(decoded,"decoded");
      const user=await this.authRepository.findById(decoded.id);
      console.log(user,"user");
      if(!user){
        const err=new Error("User not found.");
        err.statusCode=404;
        throw err;
      }
      const accessToken=this._signAccessToken(user.id);
      const   refreshToken=this._signRefreshToken(user.id);
      const {otp:_otp,otp_expires_at:_exp,...safeUser}=user;
      return {user:safeUser,accessToken,refreshToken};
    } catch (error) {
      const err=new Error("Invalid or expired refresh token.");
      err.statusCode=401;
      throw err;
    }
  }



  async getProfile(userId){ 
    const user=await this.authRepository.findById(userId);
    if(!user){
      const err=new Error("User not found.");
      err.statusCode=404;
      throw err;
    }
    const { otp: _otp, otp_expires_at: _exp, ...safeUser } = user;
    return safeUser;
  }



  async updateProfile(userId,payload){
    const user=await this.authRepository.findById(userId);
    if(!user){
      const err=new Error("User not found.");
      err.statusCode=404;
      throw err;
    }

    const { email, phone, ...rest } = payload;
    const finalData = { ...rest };

    // --- EMAIL LOGIC: Only allow if currently null or not being changed ---
    if (email) {
      if (!user.email) {
        // First time setting email → check for conflicts
        const conflict = await this.authRepository.findByEmail(email);
        if (conflict) {
          const err = new Error("This email is already registered to another account.");
          err.statusCode = 409;
          throw err;
        }
        finalData.email = email;
      } else if (user.email !== email) {
        // Email already set and trying to change it → ignore or throw
        console.warn(`User ${userId} attempted to change locked email.`);
      }
    }

    // --- PHONE LOGIC: Only allow if currently null or not being changed ---
    if (phone) {
      if (!user.phone) {
        // First time setting phone → check for conflicts
        const conflict = await this.authRepository.findByPhone(phone);
        if (conflict) {
          const err = new Error("This phone number is already registered to another account.");
          err.statusCode = 409;
          throw err;
        }
        finalData.phone = phone;
      } else if (user.phone !== phone) {
        // Phone already set and trying to change it → ignore or throw
        console.warn(`User ${userId} attempted to change locked phone number.`);
      }
    }

    const updatedUser=await this.authRepository.updateProfile(user.id, finalData);
    const { otp: _otp, otp_expires_at: _exp, ...safeUser } = updatedUser;
    return safeUser;
  }

  // ADDRESS MANAGEMENT LOGIC

  async addAddress(userId, payload) {
    const count = await this.authRepository.countAddresses(userId);
    if (count >= 10) {
      const err = new Error("Address limit reached (max 10).");
      err.statusCode = 400;
      throw err;
    }

    const isDefault = payload.isDefault === true || payload.isDefault === 'true';
    const shouldBeDefault = count === 0 || isDefault;
    if (shouldBeDefault) {
      await this.authRepository.unsetDefaultAddress(userId);
    }

    return await this.authRepository.createAddress({
      ...payload,
      userId,
      isDefault: shouldBeDefault
    });
  }

  async updateAddress(userId, addressId, payload) {
    const existing = await this.authRepository.findAddressById(addressId);
    console.log(existing, "existing");
    if (!existing || existing.userId !== userId) {
      const err = new Error("Address not found.");
      err.statusCode = 404;
      throw err;
    }

    const isDefault = payload.isDefault === true || payload.isDefault === 'true';
    if (isDefault) {
      await this.authRepository.unsetDefaultAddress(userId);
    }

    return await this.authRepository.updateAddress(addressId, userId, payload);
  }

  async removeAddress(userId, addressId) {
    const existing = await this.authRepository.findAddressById(addressId);
    if (!existing || existing.userId !== userId) {
      const err = new Error("Address not found.");
      err.statusCode = 404;
      throw err;
    }

    const wasDefault = existing.isDefault;
    await this.authRepository.deleteAddress(addressId, userId);

    if (wasDefault) {
      const remaining = await this.authRepository.findAddressesByUserId(userId);
      if (remaining.length > 0) {
        await this.authRepository.setDefaultAddress(remaining[0].id, userId);
      }
    }
  }

  async getAddresses(userId) {
    return await this.authRepository.findAddressesByUserId(userId);
  }

  async makeAddressDefault(userId, addressId, isDefault) {
    const existing = await this.authRepository.findAddressById(addressId);
    if (!existing || existing.userId !== userId) {
      const err = new Error("Address not found.");
      err.statusCode = 404;
      throw err;
    }

    const status = isDefault === true || isDefault === 'true';

    return await this.authRepository.setDefaultAddress(addressId, userId, status);
  }

  async resendOTP(payload) {
    const { email, phone } = payload;
    const identifier = email || phone;

    if (!identifier) {
      const err = new Error("Email or phone number is required.");
      err.statusCode = 400;
      throw err;
    }

    const user = await this.authRepository.findByIdentifier(identifier);
    if (!user) {
      const err = new Error("No account found with this identifier.");
      err.statusCode = 404;
      throw err;
    }

    const otp = generateOTP();
    const expiry = otpExpiresAt(10);
    await this.authRepository.saveOTP(user.id, otp, expiry);

    if (user.email) {
      this.sendEmail({
        to: user.email,
        subject: "Your new verification code – Ecommerce",
        html: otpEmailTemplate(user.name, otp),
      }).catch((err) => console.error("Email send error:", err.message));
    } else if (user.phone) {
        this.sendSMS(user.phone, otp).catch((err) => console.error("SMS send error:", err.message));
    }

    return { identifier };
  }


  
 _signAccessToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );
}


_signRefreshToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}


}

export default AuthService;
