/* userController.js */
//purpose: users.js route controller

/* Modules*/
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const generator = require("generate-password");

/* functions */
//GET
//************************************************************GET  show REGISTER page  /register
const user_GET_register = (req, res) => {
  res.render("users/register", { layout: "layouts/guestLayout" });
};
//************************************************************GET show-LOGIN-page  /login
const user_GET_login = (req, res) => {
  res.render("users/login", { layout: "layouts/guestLayout" });
};
//************************************************************GET show-LOGOUT-page  /logout
const user_GET_logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};
//************************************************************GET show-find-page  /find
const user_GET_find = (req, res) => {
  res.render("users/find", {
    layout: "layouts/guestLayout",
  });
};
//************************************************************GET show-findEmail-page  /find/email
const user_GET_findEmail = (req, res) => {
  res.render("users/findUser", {
    layout: "layouts/guestLayout",
  });
};
//************************************************************GET show-finPw-page  /find/pw
const user_GET_findPw = (req, res) => {
  console.log("get: " + req.body.name);
  res.render("users/findPw", {
    layout: "layouts/guestLayout",
  });
};
//************************************************************GET show-findPwEmail-page  /find/pw/email
const user_GET_findPw_email = (req, res) => {
  res.render("users/findPwEmail", {
    layout: "layouts/guestLayout",
  });
};
//************************************************************GET show-changePw-page  /changePw
const user_GET_changePw = (req, res) => {
  res.render("users/changePw", {
    layout: "layouts/userLayout",
    user: req.user,
  });
};
//************************************************************GET  show-delete-page  /delete
const user_GET_delete = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      res.render("users/delete", {
        layout: "layouts/userLayout",
        user: req.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//POST
//************************************************************POST add-new-user  /register
const user_POST_register = (req, res) => {
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
    res.render("users/register", {
      // if error occured, send errors and other varibles
      layout: "layouts//guestLayout",
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
        res.render("users/register", {
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
};
//************************************************************POST LOGIN  /login
const user_POST_login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
  failureFlash: true,
});
//************************************************************POST findpw  /find/pw
const user_POST_findPw = (req, res) => {
  const user = req.body;

  User.findOne({ email: user.email }).then((user) => {
    // make sure user DNE// DB:CONST
    if (user) {
      console.log("Email exists and id: " + user.id);
      req.session.user = user.id;
      res.render("users/findPwEmail", {
        layout: "layouts/guestLayout",
      });
    } else {
      console.log("email does not exist");
      req.flash("error_msg", "Email address does not exist");
      res.redirect("/users/find/pw");
    }
  });
};
//************************************************************POST  send-email  /find/pw/email
const user_POST_email = (req, res) => {
  const recvEmail = req.body.email;
  const userId = req.session.user;
  console.log("send to " + recvEmail);
  console.log("find this id " + userId);
  var randomPw = generator.generate({
    length: 10,
    numbers: true,
  });

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3ad7a9fe3f4824",
      pass: "dfc96ffee40d9b",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"idol portal" <fxnusp2@gmail.com>', // sender address
    to: recvEmail, // list of receivers
    subject: "Node mail test", // Subject line
    text: `Hello world? this is ur temporary password bitch ${randomPw}`, // plain text body
    // html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    req.flash("success_msg", "Email has been sent");
    /*********************************************************************************************** */
    //update pw

    User.findOne({ _id: userId }, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        /*********************************************************** */

        console.log("temporary pw: ", randomPw);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(randomPw, salt, (err, hash) => {
            if (err) throw err;
            let newPw = hash;
            console.log("temporary new pw1: ", newPw);
            User.findByIdAndUpdate(
              user.id,
              { password: newPw },
              function (err, user) {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/users/find/pw/email");
                }
              }
            );
          });
        });
      }
    });
  });
};
//************************************************************POST  update-PW  /changePw
const user_POST_changePw = (req, res) => {
  const newPw1 = req.body.password;
  const newPw2 = req.body.password2;
  console.log(newPw1, newPw2);

  if (newPw1 !== newPw2) {
    req.flash("error_msg", "not equal");
    res.redirect("/users/changePw");
  } else if (newPw1.length < 6) {
    req.flash("error_msg", "too less");
    res.redirect("/users/changePw");
  } else {
    /**update it */
    console.log("user.id: ", req.user.id);

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPw1, salt, (err, hash) => {
        if (err) throw err;
        let newPw = hash;
        console.log("temporary new pw: ", newPw);
        User.findByIdAndUpdate(
          req.user.id,
          { password: newPw },
          function (err, user) {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/");
            }
          }
        );
      });
    });
  }
};

//DELETE
//************************************************************DELETE  delete-user  /delete/:id
const user_DEL_user = async (req, res) => {
  console.log("im here");
  try {
    let user = await User.findById(req.params.id).lean();

    if (!user) {
      console.log("error/404");
      return res.render("/");
    }
    if (user._id != req.user.id) {
      console.log("error: " + user._id);
      res.redirect("/");
    } else {
      await User.remove({ _id: req.params.id });
      console.log("user deleted");
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    console.log("error/500");
    return res.render("/");
  }
};

/* Export module*/
module.exports = {
  user_GET_register,
  user_GET_login,
  user_GET_logout,
  user_POST_register,
  user_POST_login,
  user_GET_delete,
  user_DEL_user,
  user_GET_find,
  user_GET_findEmail,
  user_GET_findPw,
  user_POST_findPw,
  user_GET_findPw_email,
  user_POST_email,
  user_GET_changePw,
  user_POST_changePw,
};

/*NOTES*************************************************************/
//*otherway TO logout
// req.session.destroy((err) => {
//   if (err) throw err;
//   res.redirect("/");
// });
//*we are using flash msg instead of hsb because we are redirecting so we need to store at session
//*not working, maybe passport version issue
