const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String },
      postal: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
