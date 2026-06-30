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

router.use(protect);
router.get("/me", getMe);
router.post("/logout", logout);
router.put("/change-password", changePassword);

module.exports = router;
