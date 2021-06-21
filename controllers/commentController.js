/* commentController.js */
//purpose: comment.js route controller

/* Modules*/
const passport = require("passport");
const Comment = require("../models/Comment");
const helpers = require("../helpers/ejs");

/* functions */

//POST
//comment/:id
const post_comment = async (req, res) => {
  req.body.post = req.params.id;
  req.body.user = req.user.id;

  try {
    await Comment.create(req.body);
    res.redirect("/stories/" + req.params.id);
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

/* Export module*/
module.exports = {
  post_comment,
};
