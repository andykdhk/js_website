const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(" Page", PageSchema);
