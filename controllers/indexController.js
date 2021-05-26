/* indexController.js */
//purpose: index.js route controller

/* Modules*/
const passport = require("passport");
const User = require("../models/User");
const Story = require("../models/Story");
const helpers = require("../helpers/ejs");

/* functions */
//GET
//************************************************************GET HOME
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

//************************************************************GET DASHBOARD
const index_dashboard = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      layout: "layouts/userLayout",
      user: req.user,
      helpers,
      stories,
    });
    /* Error */
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

/* Export module*/
module.exports = {
  index_home,
  index_dashboard,
};
