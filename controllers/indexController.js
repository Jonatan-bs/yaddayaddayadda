const Yadda = require("../models/Yadda");
const User = require("../models/User");
const mongoose = require("mongoose");
const passport = require("passport");
const cld = require("./cloudinaryHandler");
const upload = require("./handlers/multer");

exports.createYadda = async function (req, res, next) {
  let { text, image, parentID, sponsored, tags, likes } = req.body;

  let user;
  if (req.user) {
    user = req.user._id;
  }

  if (req.file) {
    let img = await cld.upload(req);

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
    parentID,
    sponsored,
    tags,
    likes,
    user,
    image,
  });
  //Save Yadda if mongoose Validation succeeds
  newYadda
    .save()
    .then(() => {
      req.flash("success_msg", "Yadda was created");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Something went wrong");
      res.redirect("/");
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

exports.frontpage = async (req, res) => {
  const yaddas = await Yadda.find({})
    .sort([["createdAt", -1]])
    .populate("user");

  if (req.user) {
    res.render("index", {
      title: "Frontpage",
      yaddas,
      user: req.user,
    });
  } else {
    res.render("frontpage", {
      title: "frontpage",
    });
  }
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
    user: req.user,
    users,
    search: true,
  });
};

exports.settings = async (req, res) => {
  // let type = req.params.type;
  // let search = req.params.search;
  // let yaddas = [];
  // let users = [];
  // const regex = { $regex: new RegExp(search, "i") };

  // switch (type) {
  //   case "tag":
  //     queryParams = { tags: { $in: [regex.$regex] } };

  //     yaddas = await Yadda.find(queryParams)
  //       .sort([["createdAt", -1]])
  //       .populate("user");

  //     break;
  //   case "person":
  //     queryParams = {
  //       $or: [{ username: regex }, { firstname: regex }, { lastname: regex }],
  //     };
  //     users = await User.find(queryParams);
  //     break;
  //   default:
  // }

  res.render("settings", {
    title: "Settings",
    user: req.user,
  });
};

exports.followers = async (req, res) => {
  // let type = req.params.type;
  let id = req.params.id;

  const profile = await User.findById(id);

  const users = await User.find({ _id: { $in: profile.following } });

  profile.followers = users.length;

  console.log(users);

  res.render("followers", {
    title: "Followers",
    user: req.user,
    profile,
    users,
  });
};

exports.following = async (req, res) => {
  let id = req.params.id;

  const profile = await User.findById(id);

  const users = await User.find({ _id: { $in: profile.following } });

  profile.followers = users.length;

  console.log(users);

  res.render("following", {
    title: "Following",
    user: req.user,
    profile,
    users,
  });
};

exports.profile = async (req, res) => {
  // let type = req.params.type;
  let id = req.params.id;
  const yaddas = await Yadda.find({ user: id })
    .sort([["createdAt", -1]])
    .populate("user");

  const profile = await User.findById(id);

  profile.followers = await User.count({ following: { $in: id } });

  // let users = [];
  // const regex = { $regex: new RegExp(search, "i") };

  // switch (type) {
  //   case "tag":
  //     queryParams = { tags: { $in: [regex.$regex] } };

  //     yaddas = await Yadda.find(queryParams)
  //       .sort([["createdAt", -1]])
  //       .populate("user");

  //     break;
  //   case "person":
  //     queryParams = {
  //       $or: [{ username: regex }, { firstname: regex }, { lastname: regex }],
  //     };
  //     users = await User.find(queryParams);
  //     break;
  //   default:
  // }

  res.render("profile", {
    title: "Profile",
    user: req.user,
    profile,
    yaddas,
  });
};

exports.profilePic = async (req, res) => {
  try {
    let img = await cld.upload(req);

    let image = img.public_id;

    await User.findByIdAndUpdate(req.user._id, { image: image });

    req.flash("success_msg", "Profile picture was changed");
    res.redirect("/settings");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/settings");
  }
};

exports.theme = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      darkTheme: req.body.theme === "dark",
    });
    req.flash("success_msg", "Theme was changed");
    res.redirect("/settings");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/settings");
  }
};

exports.name = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    req.flash("success_msg", "Name was changed");
    res.redirect("/settings");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/settings");
  }
};

exports.follow = async (req, res) => {
  try {
    let id = req.params.id;
    // if (id === req.user._id.toString()) throw "Can't follow self";

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
    res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/");
  }
};
