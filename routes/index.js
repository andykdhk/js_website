/* Setting */
const express = require("express");
const router = express.Router();

/* routers */
//GET
//Login page
router.get("/", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

//GET
//dashboard page
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
