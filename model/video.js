let mongoose = require("mongoose");

let videoSchema = mongoose.Schema({
  url: String,
  user: String, // Reference to user
});

let Video = mongoose.model("Video", videoSchema);

module.exports = Video;
