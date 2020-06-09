const express = require("express");
const router = express.Router();
const WatchLink = require("../../models/WatchLink.js");

// check if user has watchlisted movie
router.get("/hasWatchLink/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (movieId) {
    try {
      const watchListedMovie = await WatchLink.query()
        .where({
          movie_id: movieId,
          user_id: req.session.user.id,
        })
        .limit(1);

      if (!watchListedMovie[0]) {
        return res.status(404).send({ response: "Movie is not in watchlist" });
      } else {
        return res.json({ response: "Movie is watchlisted", id: watchListedMovie[0].id });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Something went wrong with the database" });
    }
  }
});

// get all movies in watchlist of session user
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }
  
  try {
    const userWatchList = await WatchLink.query().where({
      user_id: req.session.user.id
    })
    return res.json(userWatchList);
  } catch (error) {
    return res
      .status(500)
      .send({ response: "Something went wrong with the database" });
  }
});

// add new movie to watchlist
router.post("/", async (req, res) => {
  const { movie_id } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (movie_id) {
    try {
      const existingWatchLink = await WatchLink.query()
        .where({
          movie_id: movie_id,
          user_id: req.session.user.id,
        })
        .limit(1);
      if (!existingWatchLink[0]) {
        const newWatchLink = await WatchLink.query().insert({
          user_id: req.session.user.id,
          movie_id: movie_id,
        });
        return res.json(newWatchLink);
      } else {
        return res
          .status(404)
          .send({ response: "You already have the movie in the watchlist" });
      }
    } catch (error) {
      return res.status(500).send({
        response: "Something went wrong with the database"
      });
    }
  } else {
    return res.status(404).send({ response: "No movie id provided" });
  }
});

// remove movie from watchlist
router.delete("/:id", async (req, res) => {
  watchLinkId = req.params.id;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (watchLinkId) {
    try {
      await WatchLink.query().deleteById(watchLinkId);
      return res.status(200).send({ response: "successfully deleted" });
    } catch (error) {
      return res.status(500).send({ response: "could not delete watchLink" });
    }
  } else {
    return res.status(404).send({ response: "no id provided" });
  }
});


module.exports = router;
