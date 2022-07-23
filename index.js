const express = require("express");
const path = require("path");
const router = require("./app/router");

// Create app
const app = express();

// Define public assets
const publicFolderPath = path.join(__dirname, "./app/public");
app.use(express.static(publicFolderPath));

// Set view engine
app.set("view engine", "ejs");
const viewsFolderPath = path.join(__dirname, "./app/views");
app.set("views", viewsFolderPath);

// Add router
app.use(router);

// Define app port
const port = process.env.PORT || 3000;

// Start app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
