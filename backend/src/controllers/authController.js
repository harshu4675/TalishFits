const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, createError } = require("../middleware/auth");
const {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
  clearTokenCookies,
} = require("../utils/generateToken");
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOTPEmail,
} = require("../services/emailService");
const { successResponse } = require("../utils/responseHandler");
const { OAuth2Client } = require("google-auth-library");
const logger = require("../utils/logger");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, rememberMe } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.isEmailVerified) {
    throw createError(409, "An account with this email already exists");
  }

  const EMAIL_VERIFICATION_ENABLED =
    process.env.EMAIL_VERIFICATION_ENABLED === "true";

  if (!EMAIL_VERIFICATION_ENABLED) {
    let user;

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.isEmailVerified = true;
      existingUser.lastLogin = new Date();
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        name,
        email,
        password,
        rememberMe: rememberMe || false,
        isEmailVerified: true,
        lastLogin: new Date(),
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setTokenCookies(res, accessToken, refreshToken);

    logger.info(`User signed up (email verification disabled): ${email}`);

    return successResponse(res, 201, "Account created successfully", {
      user: user.toSafeObject(),
      accessToken,
      requiresVerification: false,
    });
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  let user;

  if (existingUser && !existingUser.isEmailVerified) {
    existingUser.name = name;
    existingUser.password = password;
    existingUser.emailOTP = {
      code: otp,
      expiresAt: otpExpires,
      attempts: 0,
      verifiedAt: null,
    };
    await existingUser.save();
    user = existingUser;
  } else {
    user = await User.create({
      name,
      email,
      password,
      rememberMe: rememberMe || false,
      emailOTP: {
        code: otp,
        expiresAt: otpExpires,
        attempts: 0,
      },
    });
  }

  try {
    await sendOTPEmail(user, otp);
    logger.info(`OTP sent to ${email}`);
  } catch (emailError) {
    logger.error("Failed to send OTP email:", emailError.message);
    throw createError(
      500,
      "Failed to send verification email. Please try again.",
    );
  }

  return successResponse(res, 201, "Verification code sent to your email", {
    email: user.email,
    requiresVerification: true,
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw createError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw createError(400, "Email already verified");
  }

  if (!user.emailOTP?.code) {
    throw createError(
      400,
      "No verification code found. Please request a new one.",
    );
  }

  if (user.emailOTP.attempts >= 5) {
    throw createError(
      429,
      "Too many failed attempts. Please request a new code.",
    );
  }

  if (new Date() > new Date(user.emailOTP.expiresAt)) {
    throw createError(
      400,
      "Verification code expired. Please request a new one.",
    );
  }

  if (user.emailOTP.code !== otp) {
    user.emailOTP.attempts += 1;
    await user.save({ validateBeforeSave: false });
    throw createError(
      400,
      `Invalid code. ${5 - user.emailOTP.attempts} attempts remaining.`,
    );
  }

  user.isEmailVerified = true;
  user.emailOTP = {
    code: null,
    expiresAt: null,
    attempts: 0,
    verifiedAt: new Date(),
  };
  user.lastLogin = new Date();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  try {
    await sendWelcomeEmail(user);
  } catch (err) {
    logger.warn("Welcome email failed:", err.message);
  }

  return successResponse(
    res,
    200,
    "Email verified successfully. You are now logged in.",
    {
      user: user.toSafeObject(),
      accessToken,
      isAuthenticated: true,
    },
  );
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw createError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw createError(400, "Email already verified");
  }

  const lastOtpTime = user.emailOTP?.expiresAt
    ? new Date(user.emailOTP.expiresAt).getTime() - 10 * 60 * 1000
    : 0;
  const timeSinceLastOTP = Date.now() - lastOtpTime;

  if (timeSinceLastOTP < 60 * 1000) {
    const waitSeconds = Math.ceil((60 * 1000 - timeSinceLastOTP) / 1000);
    throw createError(
      429,
      `Please wait ${waitSeconds} seconds before requesting a new code`,
    );
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.emailOTP = {
    code: otp,
    expiresAt: otpExpires,
    attempts: 0,
    verifiedAt: null,
  };

  await user.save({ validateBeforeSave: false });

  try {
    await sendOTPEmail(user, otp);
    logger.info(`OTP resent to ${email}`);
  } catch (emailError) {
    logger.error("Failed to resend OTP:", emailError.message);
    throw createError(500, "Failed to send verification email");
  }

  return successResponse(res, 200, "New verification code sent", {
    email: user.email,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !user.password) {
    throw createError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw createError(
      403,
      "Your account has been deactivated. Contact support.",
    );
  }

  const EMAIL_VERIFICATION_ENABLED =
    process.env.EMAIL_VERIFICATION_ENABLED === "true";

  if (EMAIL_VERIFICATION_ENABLED && !user.isEmailVerified) {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOTP = {
      code: otp,
      expiresAt: otpExpires,
      attempts: 0,
    };
    await user.save({ validateBeforeSave: false });

    try {
      await sendOTPEmail(user, otp);
    } catch (err) {
      logger.error("Failed to send OTP on login:", err.message);
    }

    return successResponse(res, 200, "Please verify your email", {
      email: user.email,
      requiresVerification: true,
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.rememberMe = rememberMe || false;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  return successResponse(res, 200, "Login successful", {
    user: user.toSafeObject(),
    accessToken,
  });
});
const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw createError(400, "Google credential is required");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar: { url: picture },
      isEmailVerified: true,
      lastLogin: new Date(),
    });

    try {
      await sendWelcomeEmail(user);
    } catch (e) {
      logger.warn("Welcome email failed for Google user");
    }
  } else {
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (picture && !user.avatar?.url) {
      user.avatar = { url: picture };
    }
    user.isEmailVerified = true;
    user.lastLogin = new Date();
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  return successResponse(res, 200, "Google login successful", {
    user: user.toSafeObject(),
    accessToken,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.headers["x-refresh-token"];

  if (!token) {
    throw createError(401, "Refresh token not provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw createError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw createError(401, "Refresh token mismatch. Please login again.");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, newAccessToken, newRefreshToken);

  return successResponse(res, 200, "Token refreshed", {
    accessToken: newAccessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+refreshToken");

  if (user) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  }

  clearTokenCookies(res);

  return successResponse(res, 200, "Logged out successfully");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return successResponse(
      res,
      200,
      "If this email exists, a reset link has been sent.",
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user, resetToken);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw createError(500, "Email could not be sent. Please try again.");
  }

  return successResponse(res, 200, "Password reset link sent to your email");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw createError(400, "Reset token is invalid or has expired");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  clearTokenCookies(res);

  return successResponse(res, 200, "Password reset successful. Please login.");
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw createError(400, "Verification link is invalid or has expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return successResponse(res, 200, "Email verified successfully");
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw createError(404, "User not found");
  }

  return successResponse(res, 200, "User fetched successfully", {
    user: user.toSafeObject(),
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user.password) {
    throw createError(400, "Cannot change password for Google accounts");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw createError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return successResponse(res, 200, "Password changed successfully");
});

module.exports = {
  signup,
  verifyOTP,
  resendOTP,
  login,
  googleLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
  changePassword,
};
