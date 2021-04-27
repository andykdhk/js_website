/* auth.js */
//purpose: handling google login and logout

/* modules */
const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login
const User = require("../models/UserGoogle");

/* routers */
//GET
//auth/google
router.get(
  "/google",
  forwardAuthenticated,
  passport.authenticate("google", { scope: ["profile"] })
);

//GET
//auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  (req, res) => {
    req.flash("success_msg", "google log in");
    res.redirect("/dashboard");
  }
);

//GET
//auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "G logged out");
  res.redirect(process.env.GOOGLE_LOGOUT_PATH);
});

module.exports = router;

/*NOTES*************************************************************/
// save in session manually
// req.session.save(() => {
// req.session.passport.user = req.user.id;
//   res.redirect("/dashboard");
// });
// delete a session manually
// req.session.destroy();
// res.clearCookie("connect.sid");
