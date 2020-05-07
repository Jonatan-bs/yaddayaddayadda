const Yadda = require("../models/Yadda");
const User = require("../models/User");
const mongoose = require("mongoose");
const passport = require("passport");

exports.likeYadda = async function (req, res) {
  const id = req.body.id;
  let yadda = await Yadda.findById(id);

  if (yadda.likes.includes(req.user._id)) {
    const index = yadda.likes.indexOf(req.user._id);
    yadda.likes.splice(index, 1);
  } else {
    yadda.likes.push(req.user._id);
  }
  await yadda.save();
  res.send();
};

exports.createYadda = function (req, res) {
  let { text, images, parentID, sponsored, tags, likes } = req.body;
  if (tags.length) {
    let tagsArr = tags.split(" ");
    let tagsArrClean = [];

    tagsArr.forEach((tag) => {
      if (tag) {
        tagsArrClean.push(tag);
      }
    });
    tags = tagsArrClean;
  } else {
    tags = [];
  }

  let user;
  if (req.user) {
    user = req.user._id;
  }

  // Create new yadda object
  const newYadda = new Yadda({
    text,
    images,
    parentID,
    sponsored,
    tags,
    likes,
    user,
  });

  //Save Yadda if mongoose Validation succeeds
  newYadda
    .save()
    .then(() => {
      req.flash("success_msg", "Yadda was created");
      res.redirect("/");
    })
    .catch(() => {
      req.flash("error_msg", "Something went wrong");
      res.redirect("/");
    });
};

exports.index = function (req, res) {
  Yadda.find();
};

exports.frontpage = async (req, res) => {
  let users = [];

  const yaddas = await Yadda.find({})
    .sort([["createdAt", -1]])
    .populate("user");

  res.render("index", {
    title: "Frontpage",
    yaddas,
    userId: req.user._id,
    users,
  });
};

exports.search = async (req, res) => {
  let type = req.params.type;
  let search = req.params.search;
  let yaddas = [];
  let users = [];
  const regex = { $regex: new RegExp(search, "i") };

  switch (type) {
    case "tag":
      queryParams = { tags: { $in: [regex.$regex] } };

      yaddas = await Yadda.find(queryParams)
        .sort([["createdAt", -1]])
        .populate("user");

      break;
    case "person":
      queryParams = {
        $or: [{ username: regex }, { firstname: regex }, { lastname: regex }],
      };
      users = await User.find(queryParams);
      break;
    default:
  }

  res.render("index", {
    title: "Frontpage",
    yaddas,
    userId: req.user._id,
    users,
    search: true,
  });
};
