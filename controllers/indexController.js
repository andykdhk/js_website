const passport = require("passport");
const User = require("../models/User");
/* functions */
//************************************************************GET HOME
const index_home = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("home", {
      welcomeMsg: "Nice to meet you",
      layout: "main",
      userName: "guest",
    });
  } else if (req.isAuthenticated()) {
    res.render("home", {
      welcomeMsg: "Welcome back!!",
      layout: "main",
      userName: req.user.firstName,
      userId: req.user.id,
    });
  } else {
    console.log("error home page");
  }
};

//************************************************************GET DASHBOARD
const index_dashboard = (req, res) => {
  if (req.user.loginType === "local") {
    res.render("dashboard", {
      layout: "login",
      name: req.user.firstName,
      logout: "/users/logout",
    });
  } else if (req.user.loginType === "google") {
    res.render("dashboard", {
      layout: "login",
      name: req.user.firstName,
      logout: "/auth/logout",
    });
  } else {
    console.log("error dashboard ");
    res.render("dashboard", {
      layout: "login",
      name: req.user.firstName,
    });
  }
};

module.exports = {
  index_home,
  index_dashboard,
};
