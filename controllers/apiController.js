const Yadda = require("../models/Yadda");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const saltRounds = 10;

exports.createYadda = async function (req, res, next) {
  let { text, image, parent, sponsored, tags, likes } = req.body;

  let user;
  if (req.user) {
    user = req.user._id;
  }

  if (req.file) {
    let img = await cloudinary.upload(req);

    if (img) {
      image = img.public_id;
    } else {
      return false;
    }
  }

  if (tags && tags.length) {
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

  // Create new yadda object
  const newYadda = new Yadda({
    text,
    parent,
    sponsored,
    tags,
    likes,
    user,
    image,
  });
  if (parent) {
    const yadda = await Yadda.findById(parent);
    yadda.replyCount++;
    await yadda.save();
  }

  //Save Yadda if mongoose Validation succeeds
  newYadda
    .save()
    .then(() => {
      req.flash("success_msg", "Yadda was created");
      res.redirect("back");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Something went wrong");
      res.redirect("back");
    });
};

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

exports.profilePic = async (req, res) => {
  try {
    let img = await cloudinary.upload(req);

    let image = img.public_id;

    await User.findByIdAndUpdate(req.user._id, { image: image });

    req.flash("success_msg", "Profile picture was changed");
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("back");
  }
};

exports.theme = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      darkTheme: req.body.theme === "dark",
    });
    req.flash("success_msg", "Theme was changed");
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("back");
  }
};

exports.name = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    req.flash("success_msg", "Name was changed");
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("back");
  }
};

exports.follow = async (req, res) => {
  try {
    let id = req.params.id;
    if (id === req.user._id.toString()) throw "Can't follow self";

    let user2follow = await User.findById(id);
    if (!user2follow) throw "user doesn't exist";

    let user = await User.findById(req.user._id);
    if (user.following.includes(id)) {
      index = user.following.indexOf(id);
      user.following.splice(index, 1);
    } else {
      user.following.push(id);
    }

    await user.save();

    req.flash("success_msg", `Now following ${user2follow.username}`);
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("back");
  }
};

exports.password = async (req, res) => {
  const { opassword, npassword, cpassword } = req.body;

  try {
    let check = await bcrypt.compare(opassword, req.user.password);

    if (!check) throw "wrong password";
    if (npassword != cpassword) {
      throw "Passwords do not match";
    }

    if (npassword.length < 9) {
      throw "Password must be at least 9 characters";
    }

    let hash = await bcrypt.hash(npassword, saltRounds);

    await User.findByIdAndUpdate(req.user._id, { password: hash });

    req.flash("success_msg", "Password was changed");
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", err);
    res.redirect("back");
  }
};
