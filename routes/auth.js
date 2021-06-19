/* auth.js */
//purpose: handling google login and logout

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const authController = require("../controllers/authController");

/* routers */
//GET
router.get("/google", forwardAuthenticated, authController.auth_get_auth);
router.get("/google/callback", authController.auth_get_login);
router.get("/logout", authController.auth_get_logout);

/* Export module*/
module.exports = router;
