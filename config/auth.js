module.exports = {
  ensureAuthenticated: function (req, res, next) {
    //login: YES
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    //login: NO
    //then, fire below methods

    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/");
  },

  forwardAuthenticated: function (req, res, next) {
    //login: NO
    if (!req.isAuthenticated()) {
      // then start next function
      return next();
    }
    //login: YES
    //then, fire below methods
    req.flash("error_msg", "You are already login");
    res.redirect("/");
  },
};
