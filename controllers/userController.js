const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
/* functions */
//************************************************************GET REGISTER
const user_get_register = (req, res) => {
  res.render("register", { layout: "layouts/layout" });
};

//************************************************************GET LOGIN
const user_get_login = (req, res) => {
  res.render("login", { layout: "layouts/layout" });
};

//************************************************************GET LOGOUT
const user_get_logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

//************************************************************POST REGISTER
const user_post_register = (req, res) => {
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
      // layout: "login",
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
};

//************************************************************POST LOGIN
const user_post_login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
  failureFlash: true,
});

//************************************************************DELETE user
const user_delete_page = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      res.render("delete", {
        //layout: "login",
        userId: id,
      });
    })
    .catch((err) => {
      console.log("sibal");
      console.log(err);
    });
};
const user_delete_user = async (req, res) => {
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

const user_get_find = (req, res) => {
  res.render("find", {
    layout: "layouts/layout",
  });
};
const user_get_findEmail = (req, res) => {
  res.render("findUser", {
    // layout: "login",
  });
};
const user_get_findPw = (req, res) => {
  console.log("get: " + req.body.name);
  res.render("findPw", {
    // layout: "login",
  });
};
const user_post_findPw = (req, res) => {
  const user = req.body;

  User.findOne({ email: user.email }).then((user) => {
    // make sure user DNE// DB:CONST
    if (user) {
      console.log("Email exists and id: " + user.id);
      req.session.user = user.id;
      //req.session.save();
      res.render("findPwEmail", {
        // layout: "login",
      });
    } else {
      console.log("email does not exist");
      res.render("findPw", {
        // layout: "login",
      });
    }
  });
};
const user_get_findPw_email = (req, res) => {
  res.render("findPwEmail", {
    //layout: "login",
  });
};
const user_post_email = (req, res) => {
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
    // req.flash("success_msg", "Email has been sent");
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
                  res.redirect("/users/login");
                }
              }
            );
          });
        });
      }
    });
  });
};
const user_get_changePw = (req, res) => {
  res.render("changePw", {
    //layout: "login",
  });
};
const user_post_changePw = (req, res) => {
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
module.exports = {
  user_get_register,
  user_get_login,
  user_get_logout,
  user_post_register,
  user_post_login,
  user_delete_page,
  user_delete_user,
  user_get_find,
  user_get_findEmail,
  user_get_findPw,
  user_post_findPw,
  user_get_findPw_email,
  user_post_email,
  user_get_changePw,
  user_post_changePw,
};
/*NOTES*************************************************************/
//*otherway logout
// req.session.destroy((err) => {
//   if (err) throw err;
//   res.redirect("/");
// });
//*we are using flash msg instead of hsb because we are redirecting so we need to store at session
//*not working, maybe passport version issue
// successFlash: "Welcome!",
