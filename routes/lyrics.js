const express = require('express');
const router = express.Router();
const StarredLyrics = require('../models/StarredLyrics'); 

// Render search page
router.get('/search', (req, res) => {
  res.render('search');
});

// Handle lyrics search
router.post('/search', async (req, res) => {
  const { songName, artist } = req.body;

  if (!songName || !artist) {
    return res.render('search', { error: "Please enter both song name and artist" });
  }

  try {
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

// Star a lyric (save to MongoDB)
router.post('/starredLyrics', async (req, res) => {
  try {
    const { songName, artist, lyrics } = req.body;

    // Check if it already exists
    const existing = await StarredLyrics.findOne({ songName, artist });
    if (!existing) {
      const starredLyric = new StarredLyrics({ songName, artist, lyrics });
      await starredLyric.save();
    }

    // Redirect to starred lyrics page
    res.redirect('/starredLyrics');

  } catch (error) {
    console.error('Error saving lyrics:', error);
    res.redirect('/starredLyrics'); // still redirect even on error
  }
});

// Display all starred lyrics
router.get('/starredLyrics', async (req, res) => {
  try {
    const starredLyrics = await StarredLyrics.find().sort({ savedAt: -1 });
    res.render('starredLyrics', { starredLyrics });
  } catch (error) {
    console.error('Error fetching starred lyrics:', error);
    res.render('starredLyrics', { starredLyrics: [] });
  }
});

module.exports = router;
