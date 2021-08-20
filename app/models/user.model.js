const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    siteid: Array,
    resetToken: String,
    expireToken: Date,
  })
);
module.exports = User;
