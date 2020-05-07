const createError = require("http-errors");
require("dotenv").config();
const path = require("path");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");

// Passport Config
require("./config/passport")(passport);

// DB Config and server connect
const db = require("./config/keys").mongoURI;
mongoose
  .connect("mongodb://localhost:27017/yaddayaddayadda", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(function () {
    console.log("mongoose connection open");
  })
  .catch(function (err) {
    console.error(err);
  });

const app = express();
app.locals.pretty = app.get("env") === "development"; // pretty print html

// view engine setup pug and static
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Express session
app.use(
  require("express-session")({
    // passport initialize
    secret: "ioeruir!jkæljdklasjdæa&%", // do the keyboard cat
    resave: true, // to create entropy
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/user", require("./routes/user.js"));
app.use("/", require("./routes/index.js"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status("404").send({ message: "invalid request" });
});
module.exports = app;
