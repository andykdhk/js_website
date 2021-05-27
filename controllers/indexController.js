/* indexController.js */
//purpose: index.js route controller

/* Modules*/
const passport = require("passport");
const User = require("../models/User");
const Story = require("../models/Story");
const helpers = require("../helpers/ejs");

/* functions */
//GET
//************************************************************GET  show-HOME-page  /
const index_home = (req, res) => {
  /* before login */
  if (!req.isAuthenticated()) {
    res.render("home", {
      layout: "layouts/guestLayout",
      user: req.user,
    });
    /* after login */
  } else if (req.isAuthenticated()) {
    res.render("home", {
      layout: "layouts/userLayout",
      user: req.user,
    });
    /* Error */
  } else {
    console.log("error home page");
    res.redirect("/");
  }
};

/* Export module*/
module.exports = {
  index_home,
};
