const mongoose = require("mongoose");

const userOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  otp: {
    type: String,
    required: true,
  },
  
});

module.exports = mongoose.model("UserOtps", userOtpSchema);
