const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login
const User = require("../models/UserGoogle");
//GET /auth/google
//Auth with Google
router.get(
  "/google",
  forwardAuthenticated,
  passport.authenticate("google", { scope: ["profile"] })
);

//GET /auth/google/callback
//Google auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  (req, res) => {
    // console.log("auth.js: " + req.isAuthenticated() + req.user);
    /********************************************************** */
    // console.log("yeyeyey " + req.user.id);
    // req.session.passport.user = req.user.id;
    // req.session.save();
    res.redirect("/dashboard");
    /********************************************************** */
    // req.session.save(() => {

    //   res.redirect("/dashboard");
    // });
    // console.log(req.user.lastName);
    // res.redirect("/dashboard");
    // res.render("dashboard", {
    //   layout: "login",
    //   name: req.user.lastName,
    // });
  }
);

//     // req.flash("success_msg", "google log in");
//     // res.redirect("/dashboard"); //if successful

//GET.../auth/logout
//Logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.clearCookie("connect.sid");

  res.redirect(
    "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/"
  );
});

module.exports = router;

// async (req, res) => {
//   try {
//     const stories = await User.find({ user: req.user.firstName }).lean();
//     res.render("dashboard", {
//       layout: "login",
//       name: req.user.lastName,
//     });
//   } catch (err) {
//     console.error(err);
//     res.render("home");
//   }
// }
// );
// var auth2 = gapi.auth2.getAuthInstance();
// auth2.signOut().then(function () {
//   console.log("User signed out.");
// });
