const mongoose = require("mongoose");

const options = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const UserSchema = new mongoose.Schema(
  {
    confirmed: {
      type: Boolean,
      default: false,
    },
    firstname: {
      type: String,
      required: true,
      set: (v) => v.toLowerCase(),
    },
    lastname: {
      type: String,
      required: true,
      set: (v) => v.toLowerCase(),
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
      set: (v) => v.toLowerCase(),
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
  },
  options
);
UserSchema.virtual("followers", {
  ref: "User",
  localField: "_id",
  foreignField: "following",
});

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
UserSchema.virtual("fullname").get(function () {
  return `${capitalize(this.firstname)} ${capitalize(this.lastname)}`;
});
UserSchema.virtual("firstnameCap").get(function () {
  return `${capitalize(this.firstname)}`;
});

UserSchema.virtual("lastnameCap").get(function () {
  return `${capitalize(this.lastname)}`;
});

const User = mongoose.model("User", UserSchema, "user");

module.exports = User;
