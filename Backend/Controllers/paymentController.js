const Booking = require("../models/Booking");
const User = require("../models/User");
const Payment = require("../models/Payment");
const crypto = require("crypto");

// Initialize Razorpay
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order for customer
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!bookingId || !amount) {
      return res
        .status(400)
        .json({ message: "Booking ID and amount are required" });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify customer owns booking
    if (booking.customer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to pay for this booking" });
    }

    // Check if professional has bank details
    const professional = await User.findById(booking.professional);
    if (!professional.bankDetails || !professional.bankDetails.accountNumber) {
      return res.status(400).json({
        message:
          "Professional must connect bank account before accepting payments",
        errorCode: "BANK_ACCOUNT_REQUIRED",
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      payment_capture: 1,
    });

    // Save payment ID to booking
    booking.paymentId = order.id;
    await booking.save();

    res.json({
      message: "Payment order created",
      order_id: order.id,
      amount: amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify payment and update booking status
exports.verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // Validate payment
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update booking with payment details
    const booking = await Booking.findById(bookingId);
    booking.paymentStatus = "paid";
    booking.transactionId = razorpay_payment_id;
    await booking.save();
    
    // Create payment record for history tracking
    await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      professional: booking.professional,
      amount: booking.price,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "completed"
    });

    res.json({ message: "Payment verified successfully", booking });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create professional payout contact
exports.createProfessionalContact = async (req, res) => {
  try {
    const { name, email, phone, referenceId } = req.body;

    // Create RazorpayX contact
    const contact = await razorpay.contacts.create({
      name,
      email,
      contact: phone,
      type: "vendor",
      reference_id: referenceId,
    });

    res.json({ message: "Contact created", contact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create professional fund account
exports.createFundAccount = async (req, res) => {
  try {
    const { contactId, accountHolderName, accountNumber, ifsc, pan } = req.body;

    // Create RazorpayX fund account
    const fundAccount = await razorpay.fundAccount.create({
      contact_id: contactId,
      account_type: "bank_account",
      bank_account: {
        name: accountHolderName,
        account_number: accountNumber,
        ifsc,
      },
    });

    res.json({ message: "Fund account created", fundAccount });
  } catch (error) {
    console.error("Error creating fund account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Initiate payout to professional after OTP verification
exports.initiatePayout = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify booking is completed and ready for payout
    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Booking must be completed before payout" });
    }

    if (booking.payoutStatus !== "ready") {
      return res
        .status(400)
        .json({ message: "Booking is not ready for payout" });
    }

    // Get professional details
    const professional = await User.findById(booking.professional);
    if (
      !professional ||
      !professional.bankDetails ||
      !professional.bankDetails.accountNumber
    ) {
      return res.status(400).json({
        message: "Professional must have valid bank details for payout",
      });
    }

    // Create payout using Razorpay
    // In a real implementation, you would use the professional's fund account ID
    // For now, we'll simulate the payout process
    const payoutAmount = booking.price * 0.9; // 90% of booking price (10% platform fee)

    // Simulate payout creation
    const payout = {
      id: `payout_${Date.now()}`,
      amount: payoutAmount * 100, // in paise
      status: "processed",
      recipient: professional._id,
    };

    // Update booking with payout details
    booking.payoutStatus = "released";
    
    // Create a payment record for tracking
    await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      professional: booking.professional,
      amount: payoutAmount,
      transactionId: payout.id,
      orderId: booking.paymentId,
      status: "completed"
    });
    booking.payoutId = payout.id;
    await booking.save();

    res.json({
      message: "Payout processed successfully",
      payout,
      amount: payoutAmount,
    });
  } catch (error) {
    console.error("Error initiating payout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get payment history for a customer
exports.getCustomerPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all payments for this customer
    const payments = await Payment.find({ customer: userId })
      .populate({
        path: 'booking',
        select: 'name description'
      })
      .populate({
        path: 'professional',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    // Format the response
    const formattedPayments = payments.map(payment => ({
      id: payment._id,
      service: payment.booking ? payment.booking.name : 'Service',
      amount: payment.amount,
      date: payment.createdAt.toISOString().split('T')[0],
      status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
      professional: payment.professional ? payment.professional.name : 'Professional',
      transactionId: payment.transactionId
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
