const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const {  sendOTP,verifyOTP,registerProfessional,completeProfile } = require("../Controllers/authController");


router.post("/register-professional", registerProfessional);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/complete-profile", protect, completeProfile);


module.exports = router;
