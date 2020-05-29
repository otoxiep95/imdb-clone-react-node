const express = require("express");

const router = express.Router();
const User = require("../../models/User.js");
const WatchLink = require("../../models/WatchLink.js");

//get all movies in watch list of session user
router.get("/", async (req, res) => {
  //check if user is logged in (not done)
  try {
    const userWatchList = await WatchLink.query().where(
      "user_id",
      req.session.user.id
    );
    res.json(userWatchList);
  } catch (error) {
    res
      .status(500)
      .send({ response: "Something went wrong with the database" });
  }
});

//post new watchlink movie and user
router.post("/", async (req, res) => {
  const { movie_id } = req.body;
  //check if user is logged in (not done)
  if (movie_id) {
    if (req.session.user) {
      try {
        const existingWatchLink = await WatchLink.query().where({
          user_id: req.session.user.id,
          movie_id: movie_id,
        });
        if (!existingWatchLink) {
          const newWatchLink = await WatchLink.query().insert({
            user_id: req.session.user.id,
            movie_id,
          });
          res.json(newWatchLink);
        } else {
          res
            .status(404)
            .send({ response: "You already have it in the watching link" });
        }
      } catch (error) {
        res.status(500).send({
          response: "Something went wrong with the database",
          error: error,
        });
      }
    } else {
      res.status(403).send({ response: "fuck off you are not logged" });
    }
  } else {
    res.status(404).send({ response: "Missing fields" });
  }
});

// Export to api.js
module.exports = router;
