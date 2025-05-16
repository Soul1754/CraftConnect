const express = require('express');
const router = express.Router();
const { protect } = require('../Middlewares/authMiddleware');
const { getProfessionalReviews, getCustomerReviews } = require('../Controllers/reviewController');

// Get reviews for the authenticated professional
router.get('/professional', protect, getProfessionalReviews);

// Get reviews submitted by the authenticated customer
router.get('/customer', protect, getCustomerReviews);

module.exports = router;