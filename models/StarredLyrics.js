// using mongoose to interact with mongoDB 
const mongoose = require("mongoose");

const starredLyricsSchema = new mongoose.Schema({
  songName: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  lyrics: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

const StarredLyrics = mongoose.model("StarredLyrics", starredLyricsSchema);
module.exports = StarredLyrics;

