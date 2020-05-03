const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongoose = require("mongoose");
const sendAuthMail = require("./handlers/authMail");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const saltRounds = 10;

exports.register = function (req, res) {
  res.render("register", {
    title: "Demoing PassportJS",
    subtitle: "Inspired by Traversy",
  });
};

exports.postRegister = async function (req, res) {
  let { username, firstname, lastname, email, password, password2 } = req.body;

  let errors = [];

  email = email.toLowerCase();

  if (
    !username ||
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !password2
  ) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // if (password.length < 9) {
  //   errors.push({ msg: "Password must be at least 9 characters" });
  // }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstname,
      lastname,
      username,
      email,
      password,
      password2,
    });
  } else {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          firstname,
          lastname,
          username,
          email,
          password,
        });

        let hash = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = hash;

        let userObj = await newUser.save();

        sendAuthMail(userObj);

        req.flash(
          "success_msg",
          "A confirmation link has been sent to your email"
        );
        res.redirect("/user/login");
      }
    } catch (err) {
      errors.push({ msg: "Someting went wrong" });
      res.render("register", {
        errors,
        firstname,
        lastname,
        username,
        email,
        password,
        password2,
      });
    }
  }
};

exports.login = function (req, res) {
  res.render("login", {
    title: "Login page",
  });
};

exports.postLogin = function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
};

exports.confirm = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    await User.findOneAndUpdate({ _id: userId }, { $set: { confirmed: true } });
  } catch (err) {
    return res.send("Something went wrong");
  }

  req.flash("success_msg", "Your mail was confirmed");
  res.redirect("/user/login");
  return res.redirect("http://localhost:3000/user/login");
};
