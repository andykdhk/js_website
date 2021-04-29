/*users.js */
//purpose: handling local register, login and logout

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); //preventing user from entering page without login
const userController = require("../controllers/userController");

/* routers */
/* GET */
router.get("/register", forwardAuthenticated, userController.user_get_register); //users/register
router.get("/login", forwardAuthenticated, userController.user_get_login); //users/login
router.get("/logout", ensureAuthenticated, userController.user_get_logout); //users/logout
router.get("/delete/:id", ensureAuthenticated, userController.user_delete_page);
router.get("/find", forwardAuthenticated, userController.user_get_find);
router.get(
  "/find/email",
  forwardAuthenticated,
  userController.user_get_findEmail
);
router.get("/find/pw", forwardAuthenticated, userController.user_get_findPw);
router.get(
  "/find/pw/email",
  forwardAuthenticated,
  userController.user_get_findPw_email
);
/* POST */
router.post("/register", userController.user_post_register); //users/register <----register.hbs
router.post("/login", userController.user_post_login); //users/login <----login.hbs
router.post("/find/pw", forwardAuthenticated, userController.user_post_findPw);

router.post("/find/pw/email", userController.user_post_email); //users/login <----login.hbs

router.post("/delete/:id", userController.user_delete_user);

module.exports = router;
