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
// UserSchema.virtual("followers").get(function () {
//   User.find({ following: { $in: this._id } }, null, function (followers) {
//     return "followers";
//   });
//    return "kjlkjk";
// });

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

const User = mongoose.model("User", UserSchema, "user");

module.exports = User;
