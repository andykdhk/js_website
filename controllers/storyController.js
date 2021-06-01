/* userController.js */
//purpose: stories.js route controller

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const Story = require("../models/Story");
const helpers = require("../helpers/ejs");
const { UserRefreshClient } = require("google-auth-library");

/* functions */
//************************************************************GET  Show add page      /stories/add
const story_get_add = (req, res) => {
  var totalStory = Story.find().countDocuments();

  res.render("stories/add", {
    layout: "layouts/userLayout",
    user: req.user,
  });
};
//************************************************************GET  Show public stories   /stories/
const story_get_publicStory = async (req, res) => {
  var totalStory = await Story.find({ status: "public" }).countDocuments();

  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    /* before login */
    if (!req.isAuthenticated()) {
      console.log("im here");
      res.render("stories/publicStory", {
        layout: "layouts/guestLayout",
        user: req.user,
        helpers,
        stories,
        totalStory,
      });
      /* after login */
    } else if (req.isAuthenticated()) {
      res.render("stories/publicStory", {
        layout: "layouts/userLayout",
        user: req.user,
        helpers,
        stories,
        totalStory,
      });
      /* Error */
    } else {
      console.log("error home page");
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};
//************************************************************GET  show-DASHBOARD-page  /stories/dashboard
const story_get_dashboard = async (req, res) => {
  const page = +req.query.page || 1; // pagination
  const ITEMS_PER_PAGE = +req.query.limit || 5; // pagination
  const SORT = req.query.sort || 1; //sort menu
  let order;
  if (SORT === "views_asc") {
    order = { views: 1, createdAt: 1 };
  } else if (SORT === "views_dsc") {
    order = { views: -1, createdAt: 1 };
  } else if (SORT === "dates_asc") {
    order = { createdAt: 1, views: 1 };
  } else if (SORT === "dates_dsc") {
    order = { createdAt: -1, views: 1 };
  }

  let countStory = 0;

  try {
    const stories = await Story.find({ user: req.user.id }).lean();

    stories.forEach(async function (val) {
      await Story.findOneAndUpdate(
        { _id: val._id },
        { storyNumber: ++countStory },
        { returnOriginal: false }
      );
    });

    Story.find({ user: req.user.id })
      .countDocuments()
      .then((numberOfProducts) => {
        totalItems = numberOfProducts;
        return Story.find({ user: req.user.id })
          .sort(order)
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then((story2) => {
        res.render("stories/dashboard", {
          layout: "layouts/userLayout",
          user: req.user,
          helpers,
          stories: story2,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          limit: ITEMS_PER_PAGE,
          totalItems,
          sort: SORT,
        });
      });

    /* Error */
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

//************************************************************GET  Show single story  /stories/:id
const story_get_showSingle = async (req, res) => {
  try {
    let stories = await Story.findById(req.params.id).populate("user").lean();
    if (!stories) {
      return res.render("error/404");
    }

    /* before login */
    if (!req.isAuthenticated()) {
      /*count views for guest */
      stories = await Story.findOneAndUpdate(
        { _id: req.params.id },
        { views: ++stories.views },
        { returnOriginal: false }
      );

      res.render("stories/singleStory", {
        layout: "layouts/guestLayout",
        user: req.user,
        helpers,
        stories,
      });
      /* after login */
    } else if (req.isAuthenticated()) {
      /*count views for user */ // visit will not count own views
      if (req.user._id.toString() !== stories.user._id.toString()) {
        stories = await Story.findOneAndUpdate(
          { _id: req.params.id },
          { views: ++stories.views },
          { returnOriginal: false }
        );
      }
      if (stories.user._id != req.user.id && stories.status == "private") {
        res.render("error/404");
      } else {
        res.render("stories/singleStory", {
          layout: "layouts/userLayout",
          user: req.user,
          helpers,
          stories,
        });
      }
      /* Error */
    } else {
      console.log("error home page");
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
};

//************************************************************GET  Show edit page     /stories/eidt/:id
const story_get_edit = async (req, res) => {
  try {
    const stories = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!stories) {
      return res.render("error/404");
    }

    if (stories.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        layout: "layouts/userLayout",
        user: req.user,
        helpers,
        stories,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};
//************************************************************POST  Process add form  /stories/
const story_post_add = async (req, res) => {
  let total = await Story.find({ user: req.user.id }).countDocuments();
  try {
    req.body.storyNumber = total++;
    req.body.user = req.user.id; //add story user id
    await Story.create(req.body);
    res.redirect("/stories/dashboard");
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

      res.redirect("/stories/dashboard");
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
      res.redirect("/stories/dashboard");
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
  story_get_publicStory,
  story_get_showSingle,
  story_get_edit,
  story_get_dashboard,

  story_post_add,
  story_put_update,
  story_delete_story,
};
