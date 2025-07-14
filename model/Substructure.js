const mongoose = require("mongoose");

const substructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    structure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Structure",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Substructure", substructureSchema);
