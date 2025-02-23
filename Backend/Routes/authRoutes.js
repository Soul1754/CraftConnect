const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const {  sendOTP,verifyOTP,registerProfessional,completeProfile,registerCustomer,login } = require("../Controllers/authController");


router.post("/register-professional", registerProfessional);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/complete-profile", protect, completeProfile);
router.post("/register-customer", registerCustomer);
router.post("/login", login);

module.exports = router;
