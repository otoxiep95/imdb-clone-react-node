const express = require("express");
const app = express();

// Require router files
const usersRoutes = require("./api/users");
const reviewRoutes = require("./api/review");
const watchLinkRoutes = require("./api/watchlink");
const likeRoutes = require("./api/like");

// Include the routes to express
app.use("/users", usersRoutes);
app.use("/review", reviewRoutes);
app.use("/watch", watchLinkRoutes);
app.use("/liked", likeRoutes);

module.exports = app;
