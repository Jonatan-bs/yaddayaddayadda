const mongoose = require("mongoose");

const YaddaSchema = new mongoose.Schema({
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
});

const Yadda = mongoose.model("Yadda", YaddaSchema, "yadda");

module.exports = Yadda;
