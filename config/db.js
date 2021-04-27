/*db.js */
//purpose: DB connection

/* Load module */
const mongoose = require("mongoose"); //go get a manual of mongoose

/* Initiate DB connection*/
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

/* Export module*/
module.exports = connectDB; //put connectDB module on the market
