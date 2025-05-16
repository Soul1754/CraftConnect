// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Booking", 
    required: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  professional: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  transactionId: { 
    type: String, 
    required: true 
  },
  orderId: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  paymentMethod: { 
    type: String, 
    default: "razorpay" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Payment", PaymentSchema);