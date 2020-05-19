const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const apiRoutes = require("./routes/api");

// Start the server
const server = app.listen(9090, (error) => {
  if (error) {
    console.log("Error in the server");
  }
  console.log("Server is running on port", server.address().port);
});
