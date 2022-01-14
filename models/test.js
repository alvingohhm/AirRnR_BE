const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("test", testSchema);
