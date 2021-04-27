/*users.js */
//purpose: handling local register, login and logout

/* modules */
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user enter page without login

/* routers */
//GET
//users/register
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register", {
    layout: "login",
  });
});

//GET
//users/login
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

//POST
//users/register <----register.hbs
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
            newUser.loginType = "local";
            /* Store at DB */
            newUser
              .save()
              .then((user) => {
                req.flash(
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

//POST
//users/login <----login.hbs
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);
//GET
//users/logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;

/*NOTES*************************************************************/
//*otherway logout
// req.session.destroy((err) => {
//   if (err) throw err;
//   res.redirect("/");
// });
//*we are using flash msg instead of hsb because we are redirecting so we need to store at session
//*not working, maybe passport version issue
// successFlash: "Welcome!",
