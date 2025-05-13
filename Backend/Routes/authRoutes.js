// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const {
  registerProfessional,
  sendOTP,
  verifyOTP,
  completeProfile,
  registerCustomer,
  login,
  resendOTP,
  saveBankDetails,
  getBankDetails,
} = require("../Controllers/authController");

// Bank Details Routes
router.get("/bank-details", protect, getBankDetails);
router.put("/bank-details", protect, saveBankDetails);

router.post("/register-professional", registerProfessional);
router.post("/send-otp", sendOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/complete-profile", protect, completeProfile);
router.post("/register-customer", registerCustomer);
router.post("/login", login);

module.exports = router;
