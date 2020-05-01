const mongoose = require("mongoose");

const YaddaSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    required: true,
  },
  images: [
    {
      publicId: {
        type: String,
        required: true,
      },
    },
  ],
  parentID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  sponsored: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
    },
  ],
  likes: [
    {
      type: String,
      required: true,
    },
  ],
});

const Yadda = mongoose.model("Yadda", YaddaSchema, "yadda");

module.exports = Yadda;
