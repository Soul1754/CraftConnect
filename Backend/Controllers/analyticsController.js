const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

// Get analytics summary for professional dashboard
exports.getProfessionalAnalyticsSummary = async (req, res) => {
  try {
    const professionalId = req.user.id;
    
    // Get total bookings count and calculate change
    const totalBookings = await Booking.countDocuments({ professional: professionalId });
    const previousPeriodBookings = await Booking.countDocuments({
      professional: professionalId,
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Older than 30 days
    });
    const bookingChange = previousPeriodBookings > 0 
      ? Math.round(((totalBookings - previousPeriodBookings) / previousPeriodBookings) * 100) 
      : 0;
    
    // Get revenue data
    const payments = await Payment.find({ professional: professionalId, status: 'completed' });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const previousPeriodPayments = await Payment.find({
      professional: professionalId,
      status: 'completed',
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Older than 30 days
    });
    const previousRevenue = previousPeriodPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const revenueChange = previousRevenue > 0 
      ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100) 
      : 0;
    
    // Get rating data
    const reviews = await Review.find({ professional: professionalId });
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) 
      : 0;
    const previousPeriodReviews = await Review.find({
      professional: professionalId,
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Older than 30 days
    });
    const previousAverageRating = previousPeriodReviews.length > 0 
      ? (previousPeriodReviews.reduce((sum, review) => sum + review.rating, 0) / previousPeriodReviews.length).toFixed(1) 
      : 0;
    const ratingChange = previousAverageRating > 0 
      ? (averageRating - previousAverageRating).toFixed(1) 
      : 0;
    
    // Calculate response rate (based on quotations/replies to posts)
    // This is a simplified calculation - in a real app, you'd track all requests and responses
    const responseRate = 95; // Placeholder - would be calculated from actual data
    const responseRateChange = 3; // Placeholder - would be calculated from actual data
    
    // Get booking trends data (monthly)
    const bookingTrends = await getBookingTrendsByPeriod(professionalId, 'monthly');
    
    // Get revenue analysis data (monthly)
    const revenueAnalysis = await getRevenueAnalysisByPeriod(professionalId, 'monthly');
    
    // Get recent activity
    const recentActivity = await getRecentActivity(professionalId);
    
    res.status(200).json({
      totalBookings: {
        count: totalBookings,
        change: bookingChange
      },
      revenue: {
        amount: totalRevenue,
        change: revenueChange
      },
      rating: {
        average: parseFloat(averageRating),
        change: parseFloat(ratingChange)
      },
      responseRate: {
        rate: responseRate,
        change: responseRateChange
      },
      recentBookings: bookingTrends,
      revenueData: revenueAnalysis,
      recentActivity: recentActivity
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
};

// Get booking trends data for professional
exports.getBookingTrends = async (req, res) => {
  try {
    const professionalId = req.user.id;
    const { period = 'monthly' } = req.query;
    
    const bookingTrends = await getBookingTrendsByPeriod(professionalId, period);
    
    res.status(200).json(bookingTrends);
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking trends'
    });
  }
};

// Get revenue analysis data for professional
exports.getRevenueAnalysis = async (req, res) => {
  try {
    const professionalId = req.user.id;
    const { period = 'monthly' } = req.query;
    
    const revenueAnalysis = await getRevenueAnalysisByPeriod(professionalId, period);
    
    res.status(200).json(revenueAnalysis);
  } catch (error) {
    console.error('Error fetching revenue analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analysis'
    });
  }
};

// Helper function to get booking trends by period
async function getBookingTrendsByPeriod(professionalId, period) {
  const now = new Date();
  let startDate, groupFormat, dayFormat;
  
  if (period === 'weekly') {
    // Get data for the last 7 days
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6); // 7 days including today
    groupFormat = '%Y-%m-%d';
    dayFormat = '%a'; // Abbreviated day name (Mon, Tue, etc.)
  } else {
    // Get data for the last 6 months
    startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 5); // 6 months including current
    startDate.setDate(1); // Start from the 1st of the month
    groupFormat = '%Y-%m';
    dayFormat = '%b'; // Abbreviated month name (Jan, Feb, etc.)
  }
  
  // Aggregate bookings by period
  const bookings = await Booking.aggregate([
    {
      $match: {
        professional: professionalId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);
  
  // Format the results
  let results = [];
  
  if (period === 'weekly') {
    // Generate all days of the week
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - i));
      days.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
      });
    }
    
    // Map booking counts to days
    results = days.map(day => {
      const booking = bookings.find(b => b._id === day.dateString);
      return {
        month: day.day,
        count: booking ? booking.count : 0
      };
    });
  } else {
    // Generate all months in the range
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - (5 - i));
      date.setDate(1);
      months.push({
        date: date,
        dateString: date.toISOString().split('T')[0].substring(0, 7),
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
      });
    }
    
    // Map booking counts to months
    results = months.map(month => {
      const booking = bookings.find(b => b._id === month.dateString);
      return {
        month: month.month,
        count: booking ? booking.count : 0
      };
    });
  }
  
  return results;
}

// Helper function to get revenue analysis by period
async function getRevenueAnalysisByPeriod(professionalId, period) {
  const now = new Date();
  let startDate, groupFormat;
  
  if (period === 'weekly') {
    // Get data for the last 7 days
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6); // 7 days including today
    groupFormat = '%Y-%m-%d';
  } else {
    // Get data for the last 6 months
    startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 5); // 6 months including current
    startDate.setDate(1); // Start from the 1st of the month
    groupFormat = '%Y-%m';
  }
  
  // Aggregate payments by period
  const payments = await Payment.aggregate([
    {
      $match: {
        professional: professionalId,
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
        amount: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);
  
  // Format the results
  let results = [];
  
  if (period === 'weekly') {
    // Generate all days of the week
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - i));
      days.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
      });
    }
    
    // Map payment amounts to days
    results = days.map(day => {
      const payment = payments.find(p => p._id === day.dateString);
      return {
        month: day.day,
        amount: payment ? payment.amount : 0
      };
    });
  } else {
    // Generate all months in the range
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - (5 - i));
      date.setDate(1);
      months.push({
        date: date,
        dateString: date.toISOString().split('T')[0].substring(0, 7),
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
      });
    }
    
    // Map payment amounts to months
    results = months.map(month => {
      const payment = payments.find(p => p._id === month.dateString);
      return {
        month: month.month,
        amount: payment ? payment.amount : 0
      };
    });
  }
  
  return results;
}

// Helper function to get recent activity
async function getRecentActivity(professionalId) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Get recent bookings
  const bookings = await Booking.find({
    professional: professionalId,
    createdAt: { $gte: thirtyDaysAgo }
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('customer', 'name');
  
  // Get recent reviews
  const reviews = await Review.find({
    professional: professionalId,
    createdAt: { $gte: thirtyDaysAgo }
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('customer', 'name');
  
  // Get recent payments
  const payments = await Payment.find({
    professional: professionalId,
    status: 'completed',
    createdAt: { $gte: thirtyDaysAgo }
  })
  .sort({ createdAt: -1 })
  .limit(5);
  
  // Combine all activities
  const activities = [];
  
  // Add booking activities
  bookings.forEach(booking => {
    activities.push({
      time: booking.createdAt,
      event: `New booking received from ${booking.customer ? booking.customer.name : 'a customer'}`,
      type: 'booking'
    });
  });
  
  // Add review activities
  reviews.forEach(review => {
    activities.push({
      time: review.createdAt,
      event: `Received ${review.rating}-star rating from ${review.customer ? review.customer.name : 'a customer'}`,
      type: 'review'
    });
  });
  
  // Add payment activities
  payments.forEach(payment => {
    activities.push({
      time: payment.createdAt,
      event: `Payment of Rs ${payment.amount} received`,
      type: 'payment'
    });
  });
  
  // Sort all activities by time (most recent first)
  activities.sort((a, b) => b.time - a.time);
  
  // Format the time and limit to 10 activities
  return activities.slice(0, 10).map(activity => {
    const timeDiff = now - activity.time;
    let formattedTime;
    
    if (timeDiff < 60 * 60 * 1000) {
      // Less than an hour
      const minutes = Math.floor(timeDiff / (60 * 1000));
      formattedTime = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (timeDiff < 24 * 60 * 60 * 1000) {
      // Less than a day
      const hours = Math.floor(timeDiff / (60 * 60 * 1000));
      formattedTime = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      // Days or more
      const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      formattedTime = `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    return {
      time: formattedTime,
      event: activity.event,
      type: activity.type
    };
  });
}