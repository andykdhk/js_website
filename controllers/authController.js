/* authController.js */
//purpose: auth.js route controller

/* Modules*/
const passport = require("passport");
const User = require("../models/UserGoogle");

/* functions */
//************************************************************GET AUTH
const auth_get_auth = (req, res) => {
  passport.authenticate("google", {
    scope: ["profile"],
  });
};
//************************************************************GET LOGIN
const auth_get_login = (req, res) => {
  passport.authenticate("google", {
    failureRedirect: "/users/login",
  });
  req.flash("success_msg", "google log in");
  res.redirect("/dashboard");
};
//************************************************************GET LOGOUT
const auth_get_logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "G logged out");
  res.redirect(process.env.GOOGLE_LOGOUT_PATH);
};

/* Export module*/
module.exports = {
  auth_get_auth,
  auth_get_login,
  auth_get_logout,
};

/*NOTES*************************************************************/
// save in session manually:
// req.session.save(() => {
// req.session.passport.user = req.user.id;
//   res.redirect("/dashboard");
// });
// delete a session manually:
// req.session.destroy();
// res.clearCookie("connect.sid");
