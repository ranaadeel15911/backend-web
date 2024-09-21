let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  name: String,
  number: Number,
  address: String,
  password: String,
  points: Number,
  role: String,
  level: String,
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

let Users = mongoose.model("user", userSchema);

module.exports = Users;
