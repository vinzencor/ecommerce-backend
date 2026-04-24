/**
 * HTML email template for OTP verification.
 * @param {string} name    – user's name
 * @param {string} otp     – 6-digit OTP code
 * @returns {string}       – HTML string
 */
export const otpEmailTemplate = (name, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title> Email Preview</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Georgia,'Times New Roman',serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f0f0f0;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:4px;overflow:hidden;
                      border:1px solid #e0e0e0;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#c9a84c,#e8cc7a,#c9a84c);
                       height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:44px 52px 32px;border-bottom:1px solid #ebebeb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:13px;letter-spacing:4px;text-transform:uppercase;
                                 color:#c9a84c;font-family:Georgia,serif;font-weight:normal;">
                      
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;
                                 color:#aaaaaa;font-family:Georgia,serif;">
                      Secure Verification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 52px 36px;">

              <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;
                        text-transform:uppercase;color:#c9a84c;font-family:Georgia,serif;">
                Hello,
              </p>
              <h2 style="margin:0 0 28px;font-size:28px;font-weight:normal;
                         color:#1a1a1a;font-family:Georgia,serif;letter-spacing:-0.5px;">
                ${name}
              </h2>

              <p style="margin:0 0 36px;font-size:15px;color:#666666;
                        line-height:1.8;font-family:Georgia,serif;">
                You requested to verify your email address. Please use the
                one-time code below to complete your verification. For your
                security, this code will expire in
                <span style="color:#1a1a1a;font-weight:600;">5 minutes</span>.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:28px;">
                <tr>
                  <td style="border-top:1px solid #e8e8e8;width:40%;"></td>
                  <td align="center" style="padding:0 16px;white-space:nowrap;">
                    <span style="font-size:10px;letter-spacing:3px;text-transform:uppercase;
                                 color:#aaaaaa;font-family:Georgia,serif;">
                      Verification Code
                    </span>
                  </td>
                  <td style="border-top:1px solid #e8e8e8;width:40%;"></td>
                </tr>
              </table>

              <!-- OTP Block -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:36px;">
                <tr>
                  <td align="center"
                      style="background:#fafafa;border:1px solid #e8e8e8;
                             border-top:2px solid #c9a84c;
                             border-radius:2px;padding:32px 24px;">
                    <span style="font-size:48px;font-weight:700;letter-spacing:18px;
                                 color:#c9a84c;font-family:'Courier New',monospace;
                                 display:block;padding-left:18px;">
                      ${otp}
                    </span>
                    <p style="margin:14px 0 0;font-size:11px;letter-spacing:2px;
                              text-transform:uppercase;color:#aaaaaa;
                              font-family:Georgia,serif;">
                      Expires in 5 minutes
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning note -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fffdf5;border-left:2px solid #c9a84c;
                             padding:16px 20px;border-radius:0 2px 2px 0;">
                    <p style="margin:0;font-size:13px;color:#888888;
                              font-family:Georgia,serif;line-height:1.6;">
                      <span style="color:#c9a84c;">Note:</span>&nbsp;
                      Never share this code with anyone — our team will never
                      ask for it. If you did not initiate this request, please
                      disregard this email.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 52px 32px;border-top:1px solid #ebebeb;background:#fafafa;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:#bbbbbb;
                              font-family:Georgia,serif;letter-spacing:1px;">
                      © 2025  Inc. &nbsp;·&nbsp; All rights reserved.
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:#3a3a48;
                              font-family:Georgia,serif;letter-spacing:1px;">
                      Do not reply to this email
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#c9a84c,#e8cc7a,#c9a84c);
                       height:1px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>

        <p style="margin:20px 0 0;font-size:11px;color:#bbbbbb;
                  font-family:Georgia,serif;letter-spacing:1px;text-align:center;">
          This is an automated message · 
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export const vendorApprovalTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Account Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #28a745;">Congratulations, ${name}!</h2>
        <p>We are pleased to inform you that your vendor account has been <strong>approved</strong>.</p>
        <p>You can now log in to your dashboard and start adding your products to our marketplace.</p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.CLIENT_URL}/vendor/login" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Ecommerce Team</p>
    </div>
</body>
</html>
`;

export const vendorRejectionTemplate = (name, reason) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Account Application Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #dc3545;">Account Application Update</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your interest in joining our marketplace. After reviewing your application, we regret to inform you that your vendor account has been <strong>rejected</strong> at this time.</p>
        <p><strong>Reason for rejection:</strong><br>${reason || "Your application did not meet our current requirements or documentation standards."}</p>
        <p>If you believe this is a mistake or if you would like to provide more information, please reply to this email.</p>
        <p>Best regards,<br>The Ecommerce Team</p>
    </div>
</body>
</html>
`;

export const vendorSetupTemplate = (name, setupUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Set Up Your Vendor Account</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #c9a84c;">Welcome to Our Marketplace, ${name}!</h2>
        <p>An administrator has created a vendor account for you. To get started, please set up your account password by clicking the button below.</p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${setupUrl}" style="background-color: #c9a84c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Up Your Account</a>
        </div>
        <p>For security reasons, this link will expire in 24 hours.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Ecommerce Team</p>
    </div>
</body>
</html>
`;


export const forgotPasswordTemplate = (name, resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Forgot Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #c9a84c;">Forgot Password</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Please use the link below to verify your identity.</p>
        <div style="margin: 30px 0; text-align: center;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 18px; color: #c9a84c;">${resetLink}</span>
        </div>
        <p>For security reasons, this link will expire in 10 minutes.</p>
        <p>If you did not request to reset your password, please ignore this email.</p>
        <p>Best regards,<br>The Ecommerce Team</p>
    </div>
</body>
</html>
`;