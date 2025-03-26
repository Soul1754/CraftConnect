// authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Service = require("../models/Service");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory storage for OTPs and temporary professional registrations.
// (For production, consider a persistent storage solution.)
const otpStore = {};
const tempUsers = {};

// Helper: Generate JWT Token
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ==============================
// Professional Endpoints
// ==============================

// STEP 1: Register email & password (temporary storage)
exports.registerProfessional = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    tempUsers[email] = {
      name,
      email,
      password: hashedPassword,
      verified: false,
    };
    return res.status(200).json({ message: "Proceed to phone verification" });
  } catch (error) {
    console.error("Professional Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

// STEP 2: Send OTP to phone number
exports.sendOTP = async (req, res) => {
  const { email, phone } = req.body;
  try {
    if (!tempUsers[email]) {
      return res
        .status(400)
        .json({ message: "Please register first using your email" });
    }

    // If OTP doesn't exist or has expired, generate a new one
    if (!otpStore[phone] || otpStore[phone].expires < Date.now()) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[phone] = { otp, expires: Date.now() + 300000, lastSent: Date.now() }; // Expires in 5 mins

      await client.messages.create({
        body: `Your OTP for CraftConnect is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      tempUsers[email].phone = phone;
      return res.status(200).json({ message: "OTP sent successfully" });
    }

    return res.status(400).json({
      message: "OTP already sent. Please wait before requesting a new one.",
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

exports.resendOTP = async (req, res) => {
  const { phone } = req.body;

  if (!otpStore[phone]) {
    return res
      .status(400)
      .json({
        message: "No OTP sent previously. Please request a new OTP first.",
      });
  }

  const cooldownTime = 15000; // 60 seconds cooldown
  if (
    otpStore[phone].lastSent &&
    otpStore[phone].lastSent + cooldownTime > Date.now()
  ) {
    const remainingTime = Math.ceil(
      (otpStore[phone].lastSent + cooldownTime - Date.now()) / 1000
    );
    return res
      .status(400)
      .json({
        message: `Please wait ${remainingTime} seconds before resending OTP.`,
      });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = { otp, expires: Date.now() + 300000, lastSent: Date.now() };

  await client.messages.create({
    body: `Your OTP for CraftConnect is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  return res.status(200).json({ message: "OTP resent successfully" });
};


// STEP 3: Verify OTP and create the professional user
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });
    const tempUser = tempUsers[email];
    if (!tempUser || !tempUser.phone)
      return res
        .status(400)
        .json({ message: "Registration process not initiated" });
    const storedOtp = otpStore[tempUser.phone];
    if (!storedOtp)
      return res.status(400).json({ message: "OTP not found or expired" });
    if (Date.now() > storedOtp.expires) {
      delete otpStore[tempUser.phone];
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }
    if (storedOtp.otp !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });
    // Create the professional user in the DB.
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      role: "professional",
      profileCompleted: false,
    });
    // Clear temporary data.
    delete tempUsers[email];
    delete otpStore[tempUser.phone];
    return res
      .status(201)
      .json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during OTP verification" });
  }
};

exports.completeProfile = async (req, res) => {
  const { address, latitude, longitude, servicesOffered } = req.body;
  const userId = req.user.id; // Ensure your authentication middleware sets req.user

  try {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing location coordinates" });
    }

  
    const serviceIds = await Promise.all(
      servicesOffered.map(async (service) => {
        if (
          !service.name ||
          !service.type ||
          !service.rate ||
          !service.description
        ) {
          throw new Error(
            "Service name, type, rate, and description are required."
          );
        }
        
        const newService = await Service.create({
          name: service.name,
          type: service.type,
          price: service.rate, 
          description: service.description,
          professional: userId,
          category: service.category || undefined,
        });
        return newService._id;
      })
    );

    // Update the professional's profile.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        address,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        servicesOffered: serviceIds,
        profileCompleted: true,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Profile completed", user: updatedUser });
  } catch (error) {
    console.error("Complete Profile Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during profile completion" });
  }
};



// ==============================
// Customer Endpoints
// ==============================

// Customer Registration
exports.registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      profileCompleted: true,
    });
    return res
      .status(201)
      .json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    console.error("Customer Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during customer registration" });
  }
};

// User Login (for both Customer & Professional)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.role === "professional" && !user.profileCompleted)
      return res
        .status(400)
        .json({ message: "Please complete your profile before logging in" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    return res
      .status(200)
      .json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
