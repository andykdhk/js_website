/* index.js */
//purpose: main routes

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const indexController = require("../controllers/indexController");

/* routers */
//GET
router.get("/", indexController.index_home); //home

/* Export module*/
module.exports = router;
