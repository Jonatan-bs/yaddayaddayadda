const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  confirmed: {
    type: Boolean,
    default: false,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  following: [
    {
      type: String,
      required: true,
    },
  ],

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  darkTheme: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema, "user");

module.exports = User;