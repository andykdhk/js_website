/* comment.js */
//purpose: commnets routes

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const commentController = require("../controllers/commentController");

/* routers */
//POST
router.post("/:id", commentController.post_comment);

/* Export module*/
module.exports = router;
