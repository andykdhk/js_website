/* app.js */
//start server
//start db
//set environments
//connects to index route

/* Load modules */
const path = require("path");
const express = require("express"); //go get a manual of express module
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db"); ///go get a manual of connectDB file
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

/* Load config */
dotenv.config({ path: "./config/config.env" });

// Passport Config
require("./config/passport")(passport);

/* DB connection */
connectDB(); //use this manual

/* app instantiation */
const app = express(); //use this manual to create new obj

/* Logging(morgan) */
if (process.env.NODE_ENV === "development") {
  //use only for dev mode to see html logging
  app.use(morgan("dev"));
}

/* Handlebars(express-handlebars) */
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");
/* Bodyparser */
app.use(express.urlencoded({ extended: false }));

/* Express-session */
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

/* Passport middleware */
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

/* Static folder */
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/", require("./routes/index")); //lvl1
app.use("/users", require("./routes/users")); //lvl2

/* Variables */
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
