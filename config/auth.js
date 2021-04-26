module.exports = {
  ensureAuthenticated: function (req, res, next) {
    //login: YES
    if (req.isAuthenticated()) {
      console.log("tell me: " + req.session.passport.user);
      // if( local)
      // {res.render()}
      // else if(google)
      // {res.render()}
      // else{error}

      return next();
    }
    //login: NO
    //then, fire below methods
    console.log("Error: auth");
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
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
