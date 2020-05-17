const Yadda = require("../models/Yadda");
const User = require("../models/User");
const helper = require("./helpers/helper");

exports.frontpage = async (req, res) => {
  if (req.user) {
    let tagsOfTheWeek = await helper.tagsOfTheWeek();
    let yaddas;
    if (req.user.following.length) {
      yaddaArr = [...req.user.following, req.user._id];
      yaddas = await Yadda.find({ user: { $in: yaddaArr } })
        .sort([["createdAt", -1]])
        .populate({
          path: "user parent",
          populate: { path: "followers user" },
        });
    } else {
      yaddas = await Yadda.find({})
        .sort([["createdAt", -1]])
        .populate({
          path: "user parent",
          populate: { path: "followers user" },
        });
    }
    res.render("index", {
      title: "Frontpage",
      yaddas,
      user: req.user,
      users: [],
      tagsOfTheWeek,
    });
  } else {
    res.render("frontpage", {
      title: "frontpage",
    });
  }
};
exports.frontpageAll = async (req, res) => {
  let tagsOfTheWeek = await helper.tagsOfTheWeek();
  let yaddas;

  yaddas = await Yadda.find({})
    .sort([["createdAt", -1]])
    .populate({
      path: "user parent",
      populate: { path: "followers user" },
    });

  res.render("index", {
    title: "Frontpage",
    yaddas,
    user: req.user,
    users: [],
    tagsOfTheWeek,
    all: true,
  });
};

exports.thread = async (req, res) => {
  const id = req.params.id;

  let yadda = await Yadda.findById(id).populate({
    path: "user parent",
    populate: { path: "followers user" },
  });
  console.log();

  const subYaddas = await Yadda.find({ parent: id }).populate({
    path: "user parent",
    populate: { path: "followers user" },
  });

  let parentYaddas = await yadda.parents(yadda);
  let tagsOfTheWeek = await helper.tagsOfTheWeek();
  res.render("thread", {
    title: "Thread",
    yadda: yadda,
    user: req.user,
    subYaddas,
    parentYaddas,
    tagsOfTheWeek,
  });
};

exports.search = async (req, res) => {
  let type = req.params.type;
  let search = req.params.search;
  let yaddas = [];
  let users = [];
  const regex = { $regex: new RegExp(search, "i") };

  let tagsOfTheWeek = await helper.tagsOfTheWeek();
  switch (type) {
    case "tag":
      queryParams = { tags: { $in: [/*regex.$regex*/ search] } };

      yaddas = await Yadda.find(queryParams)
        .sort([["createdAt", -1]])
        .populate({
          path: "user parent",
          populate: { path: "followers user" },
        });

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
    tagsOfTheWeek,
  });
};

exports.settings = async (req, res) => {
  const profile = await User.findById(req.user._id).populate({
    path: "followers following",
    // populate: { path: "followers following" },
  });

  res.render("settings", {
    title: "Settings",
    user: req.user,
    profile,
  });
};

exports.followers = async (req, res) => {
  // let type = req.params.type;
  let id = req.params.id;

  const profile = await User.findById(id).populate({
    path: "followers following",
    populate: { path: "followers following" },
  });

  res.render("followers", {
    title: "Followers",
    user: req.user,
    profile,
    users: profile.followers,
  });
};

exports.following = async (req, res) => {
  let id = req.params.id;

  const profile = await User.findById(id)
    .populate("followers")
    .populate({
      path: "following",
      populate: { path: "followers" },
    });

  res.render("following", {
    title: "Following",
    user: req.user,
    profile,
    users: profile.following,
  });
};

exports.profile = async (req, res) => {
  // let type = req.params.type;
  let id = req.params.id;
  const yaddas = await Yadda.find({ user: id })
    .sort([["createdAt", -1]])
    .populate({ path: "user parent", populate: { path: "user" } });

  let profile = await User.findById(id).populate("followers");

  res.render("profile", {
    title: "Profile",
    user: req.user,
    profile,
    yaddas,
    users: [],
  });
};
