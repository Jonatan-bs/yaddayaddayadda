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
    replyCount: {
      type: Number,
      default: 0,
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

YaddaSchema.methods.parents = async function (yadda = this, parentYaddas = []) {
  if (!yadda.parent) return parentYaddas;

  let parentYadda = await Yadda.findById(yadda.parent).populate({
    path: "user",
  });

  parentYaddas.unshift(parentYadda);

  return await parentYadda.parents(parentYadda, parentYaddas);
};

// YaddaSchema.methods.replyCount = async function (parentId = this.parent) {
//   return await Yadda.countDocuments({ parent: this._id });
// };

const Yadda = mongoose.model("Yadda", YaddaSchema, "yadda");

// Yadda.getParents = async function (yadda, parentYaddas = []) {
//   if (!yadda.parent) return parentYaddas;

//   let parentYadda = await Yadda.findById(yadda.parent).populate({
//     path: "user",
//   });

//   parentYaddas.unshift(parentYadda);

//   return await Yadda.getParents(parentYadda, parentYaddas);
// };

// Yadda.findByIdLean = async (id) => {
//   let yaddaObj = await Yadda.findById(id);

//   let yadda = await Yadda.findById(id)
//     .populate({
//       path: "user",
//     })
//     .lean();

//   yadda.replyCount = await yaddaObj.replyCount();

//   return yadda;
// };
module.exports = Yadda;
