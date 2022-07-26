require('dotenv').config();
const express = require("express");
const path = require("path");
const router = require("./app/router");

// Cookies
const expressSession = require('express-session')
const cookieParser = require('cookie-parser');

// Create app
const app = express();

// Trust proxy
app.set('trust proxy', 1)

// Define public assets
const publicFolderPath = path.join(__dirname, "./app/public");
app.use(express.static(publicFolderPath));

// Set view engine
app.set("view engine", "ejs");
const viewsFolderPath = path.join(__dirname, "./app/views");
app.set("views", viewsFolderPath);

// Pour pouvoir récupérer les POST dans le req.body
app.use(express.urlencoded({extended: true}));

// let’s you use the cookieParser in your application
// app.use(cookieParser(process.env.SESSION_SECRET));
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 365 },
  }));
  
// Add router
app.use(router);

app.use((req, res)=>{
    res.status(404).send('404 NOT FOUND'); // Enchainement
  });

// Define app port
const port = process.env.PORT || 3000;

// Start app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
