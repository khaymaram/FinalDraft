const express = require('express');
// using routes for our endpoints
const router = express.Router();
const StarredLyrics = require('../models/StarredLyrics'); 

// Render search page
router.get('/search', (req, res) => {
  res.render('search');
});

// Lyrics search
router.post('/search', async (req, res) => {
  const { songName, artist } = req.body;

  if (!songName || !artist) {
    return res.render('search', { error: "Please enter both song name and artist" });
  }

  try {
    // implementing lyrics.ovh API
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(songName)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.render('search', { error: "Lyrics not found. Please check artist and song." });
    }

    const data = await response.json();

    res.render('lyricResult', {
      songName,
      artist,
      lyrics: data.lyrics || "Lyrics not available."
    });

  } catch (err) {
    console.error("Fetch error:", err);
    res.render('search', { error: "An error occurred while fetching lyrics. Try again." });
  }
});

// Save song to mongoDB
router.post('/starredLyrics', async (req, res) => {
  try {
    const { songName, artist, lyrics } = req.body;
    const starredLyric = new StarredLyrics({ songName, artist, lyrics });
    await starredLyric.save();

    // Redirect to starred lyrics page
    res.redirect('/starredLyrics');

  } catch (err) {
    console.error('Error saving lyrics:', err);
    res.redirect('/starredLyrics'); 
  }
});

// Display all starred lyrics
router.get('/starredLyrics', async (req, res) => {
  try {
    const starredLyrics = await StarredLyrics.find({});
    res.render('starredLyrics', { starredLyrics });
  } catch (error) {
    console.error('Error fetching starred lyrics:', error);
    res.render('starredLyrics', { starredLyrics: [] });
  }
});

router.get("/clear", (req, res) => {
  res.render("clear");
});

// Clear all starred lyrics
router.post("/clear", async (req, res) => {
  try {
    await StarredLyrics.deleteMany({});
    res.redirect('/'); 
  } catch (err) {
    console.error("Error clearing starred lyrics: ", err);
  }
});

module.exports = router;
