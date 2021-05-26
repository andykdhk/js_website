/* stories.js */
//purpose: story routes

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const Story = require("../models/Story");
const helperEjs = require("../helpers/ejs");
const storyController = require("../controllers/storyController");

/* routers */
//GET
router.get("/add", ensureAuthenticated, storyController.story_get_add);
router.get("/", ensureAuthenticated, storyController.story_get_showAll);
router.get("/:id", ensureAuthenticated, storyController.story_get_showSingle);
router.get("/edit/:id", ensureAuthenticated, storyController.story_get_edit);

//POST
router.post("/", ensureAuthenticated, storyController.story_post_add);

//PUT
router.put("/:id", ensureAuthenticated, storyController.story_put_update);

//DELETE
router.delete("/:id", ensureAuthenticated, storyController.story_delete_story);

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

module.exports = router;
