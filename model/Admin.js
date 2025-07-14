const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    canAccessProduct: {
      type: Boolean,
      default: false,
    },
    canAccessFilter: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if OTP is valid and not expired
adminSchema.methods.isValidOTP = function (otp) {
  return this.otp === otp && this.otpExpiresAt > new Date();
};

// Method to clear OTP after successful login
adminSchema.methods.clearOTP = function () {
  this.otp = undefined;
  this.otpExpiresAt = undefined;
  return this.save();
};

module.exports = mongoose.model("Admin", adminSchema);
