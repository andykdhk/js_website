/* auth.js */
//purpose: handling google login and logout

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const authController = require("../controllers/authController");

/* routers */
/* GET */
router.get("/google", forwardAuthenticated, authController.auth_get_auth); //auth/google
router.get("/google/callback", authController.auth_get_login); //auth/google/callback
router.get("/logout", authController.auth_get_logout); //auth/logout

module.exports = router;
