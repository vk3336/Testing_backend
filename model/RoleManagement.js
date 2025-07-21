const mongoose = require("mongoose");

const validPermissions = ["all access", "only view", "no access"];

const RoleManagementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    filter: {
      type: String,
      enum: validPermissions,
      required: true,
    },
    product: {
      type: String,
      enum: validPermissions,
      required: true,
    },
    seo: {
      type: String,
      enum: validPermissions,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoleManagement", RoleManagementSchema);
