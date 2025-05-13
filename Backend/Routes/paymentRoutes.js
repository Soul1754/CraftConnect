const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const {
  createOrder,
  verifyPayment,
  createProfessionalContact,
  createFundAccount,
  initiatePayout,
} = require("../Controllers/paymentController");

// Customer payment routes
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

// Professional payout routes
router.post("/create-contact", protect, createProfessionalContact);
router.post("/create-fund-account", protect, createFundAccount);
router.post("/initiate-payout", protect, initiatePayout);

module.exports = router;
