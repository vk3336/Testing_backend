const mongoose = require("mongoose");

const subfinishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    finish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finish",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subfinish", subfinishSchema);
