/*passport.js */
//purpose: handling local and google login
//functions:
//  1)passport.use( "google",new GoogleStrategy
//  2)passport.use("local",new LocalStrategy
//  3)passport.serializeUser(function (user, done)
//  4)passport.derializeUser(function (id, done)

/* modules */
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Userg = require("../models/UserGoogle");

/* Export module */
module.exports = function (passport) {
  /* GoogleStrategy */
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        // passReqToCallback: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          loginType: "google",
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await Userg.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await Userg.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  /* LocalStrategy */
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      (req, email, password, done) => {
        /* Match user */
        User.findOne({
          email: email,
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          /* Match password */
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              req.usedStrategy = "local-user";
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        });
      }
    )
  );
  /* SERIALIZE */
  // LocalStrategy?????? ?????? user???????????? user.id ??? session??? ?????? ??????
  passport.serializeUser(function (user, done) {
    console.log("serialization: " + user.id);
    done(null, user.id);
  });
  /* DESERIALIZE */
  // ???????????? id??? ????????? ????????? ???(req.session.passport.user)
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) done(err);
      if (user) {
        done(null, user);
      } else {
        Userg.findById(id, function (err, user) {
          if (err) done(err);

          done(null, user);
        });
      }
    });
  });
};
