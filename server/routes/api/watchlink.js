const express = require("express");

const router = express.Router();
const User = require("../../models/User.js");
const WatchLink = require("../../models/WatchLink.js");

router.get("/hasWatchLink/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  if (req.session.user) {
    try {
      const watchLink = await WatchLink.query()
        .where({
          movie_id: movieId,
          user_id: req.session.user.id,
        })
        .limit(1);
      if (watchLink[0]) {
        //res.json(watchLink);
        return res.status(200).send({ response: "In list" });
      } else {
        return res.status(404).send({ response: "Not listed" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Something went wrong with the database", error });
    }
  } else {
    return res.status(404).send({ response: "not logged in" });
  }
});

//get all movies in watch list of session user
router.get("/", async (req, res) => {
  //check if user is logged in (not done)
  try {
    const userWatchList = await WatchLink.query().where(
      "user_id",
      req.session.user.id
    );
    return res.json(userWatchList);
  } catch (error) {
    return res
      .status(500)
      .send({ response: "Something went wrong with the database" });
  }
});

//post new watchlink movie and user
router.post("/", async (req, res) => {
  //const movieId = req.params.movieId;
  const { movie_id } = req.body;

  //check if user is logged in (not done)
  if (movie_id) {
    if (req.session.user) {
      try {
        const existingWatchLink = await WatchLink.query()
          .where({
            movie_id: movie_id,
            user_id: req.session.user.id,
          })
          .limit(1);
        //res.json(existingWatchLink);
        if (!existingWatchLink[0]) {
          const newWatchLink = await WatchLink.query().insert({
            user_id: req.session.user.id,
            movie_id: movie_id,
          });
          return res.json(newWatchLink);
        } else {
          //res.json(existingWatchLink);
          return res
            .status(404)
            .send({ response: "You already have it in the watching link" });
        }
      } catch (error) {
        return res.status(500).send({
          response: "Something went wrong with the database",
          error: error,
        });
      }
    } else {
      return res.status(403).send({ response: "fuck off you are not logged" });
    }
  } else {
    return res.status(404).send({ response: "Missing fields" });
  }
});

router.delete("/:id", async (req, res) => {
  watchLinkId = req.params.id;
  if (req.session.user) {
    try {
      await WatchLink.query().deleteById(watchLinkId);
      return res.status(200).send({ response: "success deleted" });
    } catch (error) {
      return res.status(500).send({ response: "couldnt delele watchLink" });
    }
  } else {
    return res.status(403).send({ response: "Not logged in" });
  }
});

// Export to api.js
module.exports = router;
