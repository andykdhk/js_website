/* users.js */
//signIn/Up routes

/* Setting */
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login

/* routers */
//GET
//login page
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login", {
    //this url address("/") will open the login.hbs file
    layout: "login",
  });
}); /* routers */

//GET
//register page
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register", {
    layout: "login",
  });
});

//POST from register.hbs form
//register
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;

  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    console.log(firstName);
    res.render("register", {
      // if error occured, send errors and other varibles
      layout: "login",
      errors,
      firstName,
      lastName,
      email,
      password,
      password2,
    });
  } else {
    /* Validation Passed */
    User.findOne({ email: email }).then((user) => {
      //make sure user DNE// DB:CONST
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password,
        });
        /* Hash PW */
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              /* Store at DB */
              .save()
              .then((user) => {
                req.flash(
                  //we are using flash msg instead of hsb because we are redirecting so we need to store at session
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// POST from login.hbs form
// Login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/dashboard");
    // req.usedStrategy;
    // res.render("dashboard", {
    //   layout: "login",
    //   name: req.user.lastName,
    // });
  }
);

//GET
//Logout
router.get("/logout", (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) throw err;
  //   res.redirect("/");
  // });
  req.logout(); //passport middleware
  //req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;

// router.post("/login", (req, res, next) => {
//   /* login authentication*/
//   passport.authenticate("local", {
//     // successRedirect: "/dashboard",
//     failureRedirect: "/users/login",
//     failureFlash: true,
//   })(req, res, next);
//   /* when success login */
//   res.render("dashboard", {
//     layout: "login",
//     // name: req.,
//   });
// });
