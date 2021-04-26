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
  // console.log(req.user);
  res.render("home", {
    //this url address("/") will open the home.hbs file
    layout: "main",
    name: "",
  });
}); /* routers */

//GET
//login page
//make sure no previous login
// router.get("/login", (req, res) => {
//   res.render("login", {
//     layout: "login",
//   });
// });

//GET
//dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    layout: "login",
    name: req.session.passport.user,
  });
});

module.exports = router;
