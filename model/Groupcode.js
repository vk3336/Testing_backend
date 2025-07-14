const mongoose = require("mongoose");

const groupcodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    img: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Groupcode", groupcodeSchema);
