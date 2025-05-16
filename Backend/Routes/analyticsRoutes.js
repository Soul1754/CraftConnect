const express = require('express');
const router = express.Router();
const { protect } = require('../Middlewares/authMiddleware');
const {
  getProfessionalAnalyticsSummary,
  getBookingTrends,
  getRevenueAnalysis
} = require('../Controllers/analyticsController');

// Professional analytics routes
router.get('/professional/summary', protect, getProfessionalAnalyticsSummary);
router.get('/professional/bookings', protect, getBookingTrends);
router.get('/professional/revenue', protect, getRevenueAnalysis);

module.exports = router;