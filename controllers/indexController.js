/* indexController.js */
//purpose: index.js route controller

/* Modules*/
const passport = require("passport");
const User = require("../models/User");
const Story = require("../models/Story");

/* functions */
//GET
//************************************************************GET HOME
const index_home = (req, res) => {
  /* before login */
  if (!req.isAuthenticated()) {
    res.render("home", {
      layout: "layouts/layout",
      welcomeMsg: "Nice to meet you",
      userName: "guest",
      userId: "",
    });
    /* after login */
  } else if (req.isAuthenticated()) {
    res.render("home", {
      layout: "layouts/userLayout",
      welcomeMsg: "Welcome back!!",
      userName: req.user.firstName,
      userId: req.user.id,
      logout: "/users/logout",
    });
    /* Error */
  } else {
    console.log("error home page");
  }
};

//************************************************************GET DASHBOARD
const index_dashboard = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    console.log("this is story:", stories);
    /* local login */
    if (req.user.loginType === "local") {
      res.render("dashboard", {
        layout: "layouts/userLayout",
        userName: req.user.firstName,
        userId: req.user.id,
        logout: "/users/logout",
        stories,
      });
      /* google login */
    } else if (req.user.loginType === "google") {
      res.render("dashboard", {
        layout: "layouts/userLayout",
        userName: req.user.firstName,
        userId: req.user.id,
        logout: "/auth/logout",
        stories,
      });
    } else {
      console.log("error dashboard ");
      res.render("dashboard", {
        name: req.user.firstName,
      });
    }
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
