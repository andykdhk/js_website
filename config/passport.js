const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const UserG = require("../models/UserGoogle");

/* Export module */
module.exports = function (passport) {
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      (req, email, password, done) => {
        // Match user
        User.findOne({
          email: email,
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            //
            if (err) throw err;
            if (isMatch) {
              // /**************************************** */
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

  passport.serializeUser(function (user, done) {
    const strg = "local-user";
    // LocalStrategy에서 받은 user정보에서 user.id 만 session에 정보 저장
    done(null, user.id, strg);
  });

  // 매개변수 id는 세션에 저장됨 값(req.session.passport.user)
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
