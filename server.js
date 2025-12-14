const express = require("express"); // accessing express module
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // to handle post params
const path = require("path");

const app = express();
const portNumber = 3001;

require("dotenv").config({
  path: path.resolve(__dirname, "credentialsDontPost/.env"),    
});

const lyricsRouter = require("./routes/lyrics");

app.set("view engine", "ejs");
// ejs templates
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
// static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", lyricsRouter);

(async () => {
  try {
    // mongoose connection
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("Connected to MongoDB");

    console.log(`Server listening on port ${portNumber}`)
    console.log(`main URL http://localhost:${portNumber}`);
    app.listen(portNumber);

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  }
})();
