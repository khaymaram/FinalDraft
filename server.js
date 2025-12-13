const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const portNumber = 3000;
const path = require('path');


require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));
const lyricsRouter = require('./routes/lyrics');
// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', lyricsRouter);
app.use(express.static("public"));

console.log(`Server listening on port ${portNumber}`);
const homeURL = `http://localhost:${portNumber}`;
console.log(homeURL);
app.listen(portNumber);