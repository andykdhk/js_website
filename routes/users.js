/*users.js */
//purpose: handling local register, login and logout

/* modules */
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const userController = require("../controllers/userController");

/* routers */
//GET
router.get("/register", forwardAuthenticated, userController.user_GET_register);
router.get("/login", forwardAuthenticated, userController.user_GET_login);
router.get("/logout", ensureAuthenticated, userController.user_GET_logout);
router.get("/delete/:id", ensureAuthenticated, userController.user_GET_delete);
router.get("/find", forwardAuthenticated, userController.user_GET_find);
router.get(
  "/find/email",
  forwardAuthenticated,
  userController.user_GET_findEmail
);
router.get("/find/pw", forwardAuthenticated, userController.user_GET_findPw);
router.get(
  "/find/pw/email",
  forwardAuthenticated,
  userController.user_GET_findPw_email
);
router.get("/changePw", ensureAuthenticated, userController.user_GET_changePw);

//POST
router.post("/register", userController.user_POST_register);
router.post("/login", userController.user_POST_login);
router.post("/find/pw", forwardAuthenticated, userController.user_POST_findPw);
router.post("/find/pw/email", userController.user_POST_email);
router.post("/delete/:id", userController.user_DEL_user);
router.post(
  "/changePw",
  ensureAuthenticated,
  userController.user_POST_changePw
);

/* Export module*/
module.exports = router;
