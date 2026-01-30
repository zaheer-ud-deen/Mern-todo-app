const mongoose = require("mongoose");

module.exports = mongoose.model("Todo", new mongoose.Schema({
  text: String,
  userId: String
}, { timestamps: true }));
