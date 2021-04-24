/* prj02 */

/* Load modules */
const path = require("path");
const express = require("express"); //go get a manual of express module
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db"); ///go get a manual of connectDB file

/* Load config */
dotenv.config({ path: "./config/config.env" });

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
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

/* Static folder */
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/", require("./routes/index"));

/* Variables */
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
