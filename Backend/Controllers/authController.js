const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const otpStore = {}; // Temporary storage for OTPs
const tempUsers = {}; // Temporary storage for unverified professionals

const generateToken = (id,role) => {
  return jwt.sign({ id,role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// STEP 1: Register Email & Password for Professionals
exports.registerProfessional = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    tempUsers[email] = { name, email, password: hashedPassword }; // Store temporarily

    res.status(200).json({ message: "Proceed to phone verification" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// STEP 2: Send OTP for Phone Verification
exports.sendOTP = async (req, res) => {
  const { email, phone } = req.body;

  if (!tempUsers[email]) {
    return res
      .status(400)
      .json({ message: "Please start with email registration" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[phone] = otp;

  try {
    await client.messages.create({
      body: `Your OTP for CraftConnect is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    tempUsers[email].phone = phone; // Store phone number

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// STEP 3: Verify OTP & Store User in DB
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const tempUser = tempUsers[email];
  if (!tempUser || otpStore[tempUser.phone] !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    // Create user after OTP verification
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      role: "professional", // Fixed role
    });

    delete tempUsers[email]; // Clear temporary data
    delete otpStore[tempUser.phone];

    res.status(201).json({ user, token: generateToken(user._id,user.role) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// STEP 4: Complete Profile After OTP Verification
exports.completeProfile = async (req, res) => {
  const { address, servicesOffered } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { address, servicesOffered },
      { new: true }
    );

    res.status(200).json({ message: "Profile completed", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.registerCustomer= async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User
      .findOne({ email });
    if (user) return res
      .status(400)
      .json({ message: "Email already exists" });
    
    const hashedPassword = await bcrypt
      .hash(password, 10);
    user = await User
      .create({ name, email, password: hashedPassword, role: "customer" });
    
    res
      .status(201)
      .json({ user, token: generateToken(user._id,user.role) });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error });
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User
      .findOne({ email });
    if (!user) return res
      .status(400)
      .json({ message: "Invalid credentials" });
    
    const isMatch = await bcrypt
      .compare(password, user.password);
    if (!isMatch) return res
      .status(400)
      .json({ message: "Invalid credentials" });
    
    res
      .status(200)
      .json({ user, token: generateToken(user._id,user.role) });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error });
  }
}