/*users.js */
//purpose: handling local register, login and logout

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const userController = require("../controllers/userController");

/* routers */
//GET
router.get("/register", forwardAuthenticated, userController.user_get_register);
router.get("/login", forwardAuthenticated, userController.user_get_login);
router.get("/logout", ensureAuthenticated, userController.user_get_logout);
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
router.get("/changePw", ensureAuthenticated, userController.user_get_changePw);

//POST
router.post("/register", userController.user_post_register);
router.post("/login", userController.user_post_login);
router.post("/find/pw", forwardAuthenticated, userController.user_post_findPw);
router.post("/find/pw/email", userController.user_post_email);
router.post("/delete/:id", userController.user_delete_user);
router.post(
  "/changePw",
  ensureAuthenticated,
  userController.user_post_changePw
);

/* Export module*/
module.exports = router;
