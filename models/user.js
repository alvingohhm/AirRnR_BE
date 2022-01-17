const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String },
    img: { type: String },
    gender: { type: String, lowercase: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    hasRestaurant: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  const test = await bcrypt.compare(enteredPassword, this.password);
  console.log(enteredPassword);
  console.log(this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("user", userSchema);
