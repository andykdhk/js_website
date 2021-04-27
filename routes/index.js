/* index.js */
//purpose: main routes

/* modules */
const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login

/* routers */
//GET
//home
router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("home", {
      welcomeMsg: "Nice to meet you",
      layout: "main",
      name: "guest",
    });
  } else if (req.isAuthenticated()) {
    res.render("home", {
      welcomeMsg: "Welcome back!!",
      layout: "main",
      name: req.user.firstName,
    });
  } else {
    console.log("error home page");
  }
});

//GET
//dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
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
});

module.exports = router;
