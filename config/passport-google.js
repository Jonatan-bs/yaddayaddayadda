const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/user/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        done(null, user);
      } else {
        return done(null, false, { message: "Cannot register with google+" });

        // try {
        //   const newUser = await new User({
        //     firstname: profile.name.givenName,
        //     lastname: profile.name.familyName,
        //     username: profile.displayName,
        //     email: profile.emails[0].value,
        //     confirmed: profile.emails[0].verified,
        //   }).save();

        // } catch (err) {
        //   console.log(err);
        // }
      }
    }
  )
);
