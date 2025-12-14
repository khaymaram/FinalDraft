const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

require("dotenv").config({
  path: path.resolve(__dirname, "credentialsDontPost/.env"),
});

const lyricsRouter = require("./routes/lyrics");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", lyricsRouter);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  }
})();
