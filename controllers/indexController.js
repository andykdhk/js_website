const passport = require("passport");
const User = require("../models/User");
/* functions */
//************************************************************GET HOME
const index_home = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("home", {
      layout: "layouts/layout",
      welcomeMsg: "Nice to meet you",
      userName: "guest",
      userId: "",
    });
  } else if (req.isAuthenticated()) {
    res.render("home", {
      layout: "layouts/userLayout",
      welcomeMsg: "Welcome back!!",
      userName: req.user.firstName,
      userId: req.user.id,
      logout: "/users/logout",
    });
  } else {
    console.log("error home page");
  }
};

//************************************************************GET DASHBOARD
const index_dashboard = (req, res) => {
  if (req.user.loginType === "local") {
    res.render("dashboard", {
      layout: "layouts/userLayout",
      userName: req.user.firstName,
      userId: req.user.id,
      logout: "/users/logout",
    });
  } else if (req.user.loginType === "google") {
    res.render("dashboard", {
      layout: "layouts/userLayout",
      userName: req.user.firstName,
      userId: req.user.id,
      logout: "/auth/logout",
    });
  } else {
    console.log("error dashboard ");
    res.render("dashboard", {
      name: req.user.firstName,
    });
  }
};

module.exports = {
  index_home,
  index_dashboard,
};
