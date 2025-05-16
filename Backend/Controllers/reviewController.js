const Review = require('../models/Review');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get reviews for the authenticated professional
exports.getProfessionalReviews = async (req, res) => {
  try {
    // Get the professional ID from the authenticated user
    const professionalId = req.user.id;

    // Find all reviews for this professional and populate both customer and booking information
    const reviews = await Review.find({ professional: professionalId })
      .populate('customer', 'name') // Populate customer name
      .populate('booking', 'name description') // Populate booking service details
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Format the reviews with all necessary information
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      customerName: review.customer.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      // Include service information from the booking if available
      serviceName: review.booking ? review.booking.name : 'Service',
      serviceDescription: review.booking ? review.booking.description : ''
    }));

    res.status(200).json({
      success: true,
      reviews: formattedReviews
    });
  } catch (error) {
    console.error('Error fetching professional reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// Get reviews submitted by the authenticated customer
exports.getCustomerReviews = async (req, res) => {
  try {
    // Get the customer ID from the authenticated user
    const customerId = req.user.id;

    // Find all reviews submitted by this customer and populate necessary information
    const reviews = await Review.find({ customer: customerId })
      .populate('professional', 'name') // Populate professional name
      .populate('booking', 'name description date') // Populate booking service details and date
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Format the reviews with all necessary information
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      professionalName: review.professional.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      // Include service information from the booking if available
      serviceName: review.booking ? review.booking.name : 'Service',
      serviceDescription: review.booking ? review.booking.description : '',
      date: review.booking ? review.booking.date : review.createdAt
    }));

    res.status(200).json({
      success: true,
      reviews: formattedReviews
    });
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};