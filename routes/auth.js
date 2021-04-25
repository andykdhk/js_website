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
  async (req, res) => {
    try {
      const stories = await User.find({ user: req.user.firstName }).lean();
      res.render("dashboard", {
        layout: "login",
        name: req.user.firstName,
      });
    } catch (err) {
      console.error(err);
      res.render("home");
    }
  }
);

//     // req.flash("success_msg", "google log in");
//     // res.redirect("/dashboard"); //if successful

//GET /auth/logout
//Logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "google log out");
  res.redirect("/");
});

module.exports = router;
