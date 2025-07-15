const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: false,
    },
    image2: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
    videoThumbnail: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    substructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Substructure",
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },
    subfinish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subfinish",
      required: true,
    },
    subsuitable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsuitable",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    groupcode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groupcode",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    motif: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Motif",
      required: false,
    },
    um: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: false,
    },
    gsm: {
      type: Number,
      required: false,
    },
    oz: {
      type: Number,
      required: false,
    },
    cm: {
      type: Number,
      required: false,
    },
    inch: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

// 🚀 ULTRA-FAST INDEXING for maximum performance
// name index is automatically created by unique: true
productSchema.index({ category: 1 });
productSchema.index({ substructure: 1 });
productSchema.index({ content: 1 });
productSchema.index({ design: 1 });
productSchema.index({ subfinish: 1 });
productSchema.index({ subsuitable: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ groupcode: 1 });
productSchema.index({ color: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Product", productSchema);
