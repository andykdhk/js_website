/* index.js */
//main routes

/* Setting */
const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login

/* routers */
//GET
//home page
router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("home", {
      //this url address("/") will open the home.hbs file
      layout: "main",
      name: "guest",
    });
  } else if (req.isAuthenticated()) {
    // console.log(req.user);
    res.render("home", {
      //this url address("/") will open the home.hbs file
      layout: "main",
      name: req.user.firstName,
    });
  } else {
    console.log("error home page");
  }
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
  console.log("tell me: " + req.user.loginType);

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

//  passport.authenticate("local", { failureRedirect: "/" }),
// (req, res) => {
//   res.render("dashboard", {
//     //this url address("/") will open the home.hbs file
//     layout: "login",
//     name: req.user.firstName,
//   });
// };
//   passport.authenticate("local", { failureRedirect: "/" }),
//     (req, res) => {
//       res.render("dashboard", {
//         //this url address("/") will open the home.hbs file
//         layout: "login",
//         name: req.user.firstName,
//       });
//     };
// else if(){
// }
//   passport.authenticate("google", { failureRedirect: "/" }),
//     (req, res) => {
//       res.render("dashboard", {
//         //this url address("/") will open the home.hbs file
//         layout: "login",
//         name: req.user.firstName,
//       });
//     };
