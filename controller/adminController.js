const Admin = require("../model/Admin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP to admin email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email matches the allowed emails from environment variable
    const allowedEmails = process.env.ALLOW_EMAIL;
    if (!allowedEmails) {
      return res.status(500).json({
        success: false,
        message: "Allowed emails not configured in environment variables",
      });
    }

    const allowedEmailList = allowedEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (!allowedEmailList.includes(email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized email address",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create admin record
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({
        email,
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      });
    } else {
      admin.otp = otp;
      admin.otpExpiresAt = otpExpiresAt;
    }

    await admin.save();

    // Send OTP via email
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin Login OTP",
      html: `
        <h2>Admin Login OTP</h2>
        <p>Your OTP for admin login is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to admin email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Verify OTP and login admin
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the email matches the allowed emails from environment variable
    const allowedEmails = process.env.ALLOW_EMAIL;
    if (!allowedEmails) {
      return res.status(500).json({
        success: false,
        message: "Allowed emails not configured in environment variables",
      });
    }

    const allowedEmailList = allowedEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (!allowedEmailList.includes(email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized email address",
      });
    }

    // Find admin record
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify OTP
    if (!admin.isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Clear OTP and update login status
    await admin.clearOTP();
    admin.isLoggedIn = true;
    admin.lastLoginAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        email: admin.email,
        isLoggedIn: admin.isLoggedIn,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

// Logout admin
const logoutAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const allowedEmails = process.env.ALLOW_EMAIL;
    if (!allowedEmails) {
      return res.status(500).json({
        success: false,
        message: "Allowed emails not configured in environment variables",
      });
    }
    const allowedEmailList = allowedEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (!allowedEmailList.includes(email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized email address",
      });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    admin.isLoggedIn = false;
    await admin.save();
    res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout admin",
      error: error.message,
    });
  }
};

// Get admin status
const getAdminStatus = async (req, res) => {
  try {
    const { email } = req.query;
    const allowedEmails = process.env.ALLOW_EMAIL;
    if (!allowedEmails) {
      return res.status(500).json({
        success: false,
        message: "Allowed emails not configured in environment variables",
      });
    }
    const allowedEmailList = allowedEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (!allowedEmailList.includes(email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized email address",
      });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    // Auto-logout logic
    if (admin.isLoggedIn && admin.lastLoginAt) {
      const sessionHours = parseFloat(process.env.ADMIN_SESSION_HOURS) || 2;
      const sessionExpiry = new Date(
        admin.lastLoginAt.getTime() + sessionHours * 60 * 60 * 1000
      );
      if (new Date() > sessionExpiry) {
        admin.isLoggedIn = false;
        await admin.save();
        return res.status(401).json({
          success: false,
          message: `Session expired after ${sessionHours} hours. Please login again.`,
        });
      }
    }
    res.status(200).json({
      success: true,
      data: {
        email: admin.email,
        isLoggedIn: admin.isLoggedIn,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get admin status",
      error: error.message,
    });
  }
};

// Controller to get the number of allowed admins
const getAllowedAdminCount = (req, res) => {
  const allowedEmails = process.env.ALLOW_EMAIL;
  if (!allowedEmails) {
    return res.status(500).json({
      success: false,
      message: "Allowed emails not configured in environment variables",
    });
  }
  const allowedEmailList = allowedEmails
    .split(",")
    .map((e) => e.trim().toLowerCase());
  res.status(200).json({
    success: true,
    count: allowedEmailList.length,
    emails: allowedEmailList,
  });
};

// Get all admins and their permissions
const getAllAdminPermissions = async (req, res) => {
  try {
    const admins = await Admin.find(
      {},
      "email canAccessProduct canAccessFilter"
    );
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update permissions for a specific admin
const updateAdminPermissions = async (req, res) => {
  try {
    // Super admin check removed; frontend already restricts access
    const { email, canAccessProduct, canAccessFilter } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    if (typeof canAccessProduct === "boolean")
      admin.canAccessProduct = canAccessProduct;
    if (typeof canAccessFilter === "boolean")
      admin.canAccessFilter = canAccessFilter;
    await admin.save();
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get permissions for a specific admin by email
const getAdminPermissions = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    const admin = await Admin.findOne(
      { email },
      "email canAccessProduct canAccessFilter"
    );
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all allowed emails and their permissions (even if not in DB)
const getAllAllowedAdminsWithPermissions = async (req, res) => {
  try {
    const allowedEmails = (process.env.ALLOW_EMAIL || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const admins = await Admin.find({ email: { $in: allowedEmails } });
    const adminMap = {};
    admins.forEach((a) => {
      adminMap[a.email.toLowerCase()] = a;
    });

    const result = allowedEmails.map((email) => {
      const admin = adminMap[email];
      return {
        email,
        canAccessProduct: admin ? admin.canAccessProduct : false,
        canAccessFilter: admin ? admin.canAccessFilter : false,
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  logoutAdmin,
  getAdminStatus,
  getAllowedAdminCount,
  getAllAdminPermissions,
  updateAdminPermissions,
  getAdminPermissions,
  getAllAllowedAdminsWithPermissions,
};
