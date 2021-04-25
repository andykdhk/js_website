/* index.js */
//main routes

/* Setting */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login

/* routers */
//GET
//home page
router.get("/", (req, res) => {
  res.render("home", {
    //this url address("/") will open the home.hbs file
    layout: "main",
  });
}); /* routers */

//GET
//login page
router.get("/login", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

//GET
//dashboard page
router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    layout: "login",
    // name: req.user.firstName,
  });
});

module.exports = router;
