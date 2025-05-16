const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const {
  createOrder,
  verifyPayment,
  createProfessionalContact,
  createFundAccount,
  initiatePayout,
  getCustomerPaymentHistory,
} = require("../Controllers/paymentController");

// Customer payment routes
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/history", protect, getCustomerPaymentHistory);

// Professional payout routes
router.post("/create-contact", protect, createProfessionalContact);
router.post("/create-fund-account", protect, createFundAccount);
router.post("/initiate-payout", protect, initiatePayout);

module.exports = router;
