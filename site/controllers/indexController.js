const Yadda = require("../models/Yadda");
const mongoose = require("mongoose");
const passport = require("passport");

exports.createYadda = function (req, res) {
  const { text, images, parentID, sponsored, tags, likes } = req.body;

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
  const yaddas = await Yadda.find({}).populate("user");
  res.render("index", {
    title: "Frontpage",
    yaddas,
  });
};

exports.search = async (req, res) => {
  let type = req.params.type;
  let search = req.params.search;
  const yaddas = await Yadda.find({});
  res.render("index", {
    title: "Frontpage",
    yaddas,
  });
};
