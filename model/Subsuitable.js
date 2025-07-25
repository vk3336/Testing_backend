const mongoose = require("mongoose");

const subsuitableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    suitablefor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suitablefor",
      required: true,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subsuitable", subsuitableSchema);
