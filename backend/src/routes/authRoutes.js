const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/change-password", protect, changePassword);

module.exports = router;
