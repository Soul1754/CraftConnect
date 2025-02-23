const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Service = require("../Models/Service");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const otpStore = {}; // Temporary storage for OTPs with expiration
const tempUsers = {}; // Temporary storage for unverified professionals

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// STEP 1: Register Email & Password for Professionals
exports.registerProfessional = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    tempUsers[email] = {
      name,
      email,
      password: hashedPassword,
      verified: false,
    };

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

  if (otpStore[phone] && otpStore[phone].expires > Date.now()) {
    return res.status(400).json({ message: "OTP already sent. Please wait." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phone] = { otp, expires: Date.now() + 300000 }; // Expires in 5 mins

  try {
    await client.messages.create({
      body: `Your OTP for CraftConnect is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    tempUsers[email].phone = phone;
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// STEP 3: Verify OTP & Store User in DB
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const tempUser = tempUsers[email];

  if (
    !tempUser ||
    !otpStore[tempUser.phone] ||
    otpStore[tempUser.phone].otp !== parseInt(otp)
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      role: "professional",
      profileCompleted: false,
    });

    delete tempUsers[email];
    delete otpStore[tempUser.phone];

    res.status(201).json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



exports.completeProfile = async (req, res) => {
  const { address, servicesOffered } = req.body; // servicesOffered is expected as a comma-separated string
  console.log(req.user);
  const userId = req.user.id;

  try {
    // Split the services string into an array of trimmed service names
 let serviceNames = Array.isArray(servicesOffered)
   ? servicesOffered
   : servicesOffered
       .split(",")
       .map((s) => s.trim())
       .filter((s) => s);

    let createdServiceIds = [];

    // For each service name, create a new Service document
    for (const serviceName of serviceNames) {
      const serviceDoc = await Service.create({
        name: serviceName,
        professional: userId,
      });
      createdServiceIds.push(serviceDoc._id);
    }

    // Update the user document:
    // - Set the address
    // - Push the newly created service IDs into the servicesOffered array
    // - Mark the profile as completed
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        address,
        $push: { servicesOffered: { $each: createdServiceIds } },
        profileCompleted: true,
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile completed", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      profileCompleted:"true",
    });

    res.status(201).json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === "professional" && !user.profileCompleted) {
      return res
        .status(400)
        .json({ message: "Please complete your profile before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
