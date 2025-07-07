// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender.js");
require("dotenv").config();

// Helper function to validate email format
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// SEND OTP CONTROLLER
exports.sendOTP = async (req, res) => {
  try {
    // STEP 1: Get email from request
    const { email } = req.body;

    // STEP 2: Validate email format
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    // STEP 3: Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    // STEP 4: Generate unique OTP
    let otp;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    } while (await OTP.findOne({ otp }));

    // STEP 5: Save OTP to database
    const otpEntry = await OTP.create({ email, otp });

    // STEP 6: Send response (OTP sent via email through pre-save hook)
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpId: otpEntry._id,
    });

  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};