const express = require("express");
const app = express();
console.log("got express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:9090", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

const Knex = require("knex");
const knexFile = require("./knexfile.js");
const knex = Knex(knexFile.development);

const { Model } = require("objection");

Model.knex(knex);

const session = require("express-session");

app.use(
  session({
    secret: `secret-key`,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api", apiRoutes);

// Start the server
const server = app.listen(9090, (error) => {
  if (error) {
    console.log("Error in the server");
  }
  console.log("Server is running on port", server.address().port);
});
