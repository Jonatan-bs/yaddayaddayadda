const mongoose = require("mongoose");

const YaddaSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },

    parent: {
      type: String,
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
  },
  { timestamps: true }
);

YaddaSchema.virtual("dateFormatted").get(function () {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = this.createdAt;
  var d = date.getDate();
  var m = monthNames[date.getMonth()];
  var y = date.getFullYear();
  var h = date.getHours();
  var min = date.getMinutes();

  return d + " " + m + " " + y + " - " + h + ":" + min;
});

const Yadda = mongoose.model("Yadda", YaddaSchema, "yadda");

module.exports = Yadda;
