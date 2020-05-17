const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/User");

// MATCH USER WITH BCRYPT
module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, function (
      email,
      password,
      done
    ) {
      // Match user
      User.findOne({
        email: email,
      }).then(function (user) {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }
        if (!user.confirmed) {
          return done(null, false, {
            message: "Please confirm your email to login",
          });
        }

        // Match password
        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
