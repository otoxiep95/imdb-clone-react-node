const express = require("express");
const app = express();
// Require router files
const usersRoutes = require("./api/users");
const reviewRoutes = require("./api/review");
const watchLinkRoutes = require("./api/watchlink");
// Include the routes to express
app.use("/users", usersRoutes);
app.use("/review", reviewRoutes);
app.use("/watch", watchLinkRoutes);

// Export the file to be used in server.js
module.exports = app;
