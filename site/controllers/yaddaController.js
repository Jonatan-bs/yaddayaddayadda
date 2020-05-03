const mongoose = require("mongoose");
const passport = require("passport");

const Yadda = require("../models/Yadda");

exports.create = function (req, res) {
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
      res.redirect(req.url);
    })
    .catch(() => {
      req.flash("error_msg", "Something went wrong");
      res.redirect(req.url);
    });
};

exports.index = function (req, res) {
  Yadda.find();
};
