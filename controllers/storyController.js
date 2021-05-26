/* userController.js */
//purpose: stories.js route controller

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const Story = require("../models/Story");
const helperEjs = require("../helpers/ejs");

/* functions */
//************************************************************GET  Show add page      /stories/add
const story_get_add = (req, res) => {
  res.render("stories/add", {
    layout: "layouts/userLayout",
    userName: req.user.firstName,
    userId: req.user.id,
    logout: "/users/logout",
  });
};
//************************************************************GET  Show all stories   /stories/
const story_get_showAll = async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      layout: "layouts/userLayout",
      userName: req.user.firstName,
      userId: req.user.id,
      logout: "/users/logout",
      helpers: helperEjs,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};
//************************************************************GET  Show single story  /stories/:id
const story_get_showSingle = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user._id != req.user.id && story.status == "private") {
      res.render("error/404");
    } else {
      res.render("stories/show", {
        layout: "layouts/userLayout",
        userName: req.user.firstName,
        userId: req.user.id,
        user: req.user,
        logout: "/users/logout",
        helpers: helperEjs,
        stories: story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
};
//************************************************************GET  Show edit page     /stories/eidt/:id
const story_get_edit = async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        layout: "layouts/userLayout",
        userName: req.user.firstName,
        userId: req.user.id,
        user: req.user,
        logout: "/users/logout",
        helpers: helperEjs,
        stories: story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};
//************************************************************POST  Process add form  /stories/
const story_post_add = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};
//************************************************************PUT  Update story       /stories/:id
const story_put_update = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};
//************************************************************DELETE  Delete story    /stories/:id
const story_delete_story = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};

// // @desc    User stories
// // @route   GET /stories/user/:userId
// router.get('/user/:userId', ensureAuth, async (req, res) => {
//   try {
//     const stories = await Story.find({
//       user: req.params.userId,
//       status: 'public',
//     })
//       .populate('user')
//       .lean()

//     res.render('stories/index', {
//       stories,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })

module.exports = {
  story_get_add,
  story_get_showAll,
  story_get_showSingle,
  story_get_edit,
  story_post_add,
  story_put_update,
  story_delete_story,
};
