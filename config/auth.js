/*auth.js */
//purpose: check if user logged in or not
//functions:
//  1)ensureAuthenticated: function (req, res, next)
//  2)forwardAuthenticated: function (req, res, next)

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    //login: YES
    if (req.isAuthenticated()) {
      // then start next function
      return next();
    }
    //login: NO
    //so, fire below methods
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/");
  },

  forwardAuthenticated: function (req, res, next) {
    //login: NO
    if (!req.isAuthenticated()) {
      // then, start next function
      return next();
    }
    //login: YES
    //so fire below methods
    req.flash("error_msg", "You are already login");
    res.redirect("/");
  },
};
