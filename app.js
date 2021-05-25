/* app.js */
//set modules
//start db
//connects to index route
//start server

/* Load modules */
//go get a manual of each modules
const express = require("express"); //web framework:to prvide useful libraries and classes
const path = require("path"); //a module provides a way of working with directories and file paths
const mongoose = require("mongoose"); // ODB library for MongoDB
const dotenv = require("dotenv"); // javascript package :allows you to separate secrets from your source code.
const morgan = require("morgan"); // middleware to log HTTP requests and errors
const exphbs = require("express-handlebars"); // view engine for Express: for template execution faster
const connectDB = require("./config/db"); // DB connection
const flash = require("connect-flash"); //message middleware for Connect.
const session = require("express-session"); //a middleware: creating the session, setting the session cookie and creating the session object in req object
const MongoStore = require("connect-mongo")(session); //MongoStore (or RedisStore) allows you to store the Express sessions into MongoDB/Redis instead of using the MemoryStore, which is not designed for a production environment.
const passport = require("passport"); //authentication middleware
const expressLayouts = require("express-ejs-layouts");

/* Load config */
dotenv.config({ path: "./config/config.env" });

/* Passport Config */
require("./config/passport")(passport); //local strategy

/* DB connection */
connectDB(); //start DB

/* app instantiation */
const app = express(); //use express manual to create new obj

/* Logging(morgan) */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //use only for dev mode to see html logging
}

/* Handlebars(express-handlebars) */
// app.engine(
//   ".hbs",
//   exphbs({
//     defaultLayout: "main",
//     layoutsDir: __dirname + "/views/layouts/",
//     partialsDir: __dirname + "/views/partials/",
//     extname: ".hbs",
//   })
// );
// app.set("view engine", ".hbs");

/* EJS helpers*/
// const formatDate = require("./helpers/ejs");

/* EJS */
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/views/ejs"));
app.set("view engine", "ejs");

/* Bodyparser */
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

/* Express-session */
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

/* Passport middleware */
app.use(passport.initialize());
app.use(passport.session());

/* Connect flash */
app.use(flash());

/* Global variables */
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;

  next();
});

/* Static folder */
app.use(express.static(path.join(__dirname, "/public")));

/* Routes */
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

/* Variables */
const PORT = process.env.PORT || 3000;

/* START SERVER*/
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
