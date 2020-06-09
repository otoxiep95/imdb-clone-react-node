const express = require("express");
const router = express.Router();
const MovieLike = require("../../models/MovieLike.js");

// check if the user has liked the movie
router.get("/isLiked/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (movieId) {
    try {
    const likedMovie = await MovieLike.query()
      .where({
        movie_id: movieId,
        user_id: req.session.user.id
      })
      .limit(1);

      if (!likedMovie[0]) {
        return res.status(404).send({ response: "Not liked" });
      } else {
        return res.json({ response: "Liked", id: likedMovie[0].id });
      }
    } catch(error) {
        return res
        .status(500)
        .send({ response: "Something went wrong with the database" });
    }
  } else {
    return res.status(404).send({ response: "No movie id" });
  }
});

// get all liked movies from a user
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }
  
  try {
    const userLikedList = await MovieLike.query().where({
      user_id: req.session.user.id
    });
    return res.json(userLikedList);
  } catch (error) {
      return res
        .status(500)
        .send({ response: "Something went wrong with the database" });
  }
});

// post new like
router.post("/", async (req, res) => {
  const { movie_id } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (movie_id) {
    try {
      const isMovieLiked = await MovieLike.query()
        .where({
          movie_id: movie_id,
          user_id: req.session.user.id,
        })
        .limit(1);
      if (!isMovieLiked[0]) {
        const newLike = await MovieLike.query().insert({
          movie_id,
          user_id: req.session.user.id,
        });
        return res.json(newLike);
      } else {
        return res
          .status(400)
          .send({ response: "You already like this movie" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "something went wrong in the database" });
    }
  } else {
    return res.status(400).send({ response: "No id provided" });
  }
});

// Unlike a movie
router.delete("/:id", async (req, res) => {
  const likeId = req.params.id;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }
  
  if (likeId) {
    try {
      await MovieLike.query().deleteById(likeId);
      return res.send({ response: "successfully unliked movie" });
    } catch (error) {
      return res.status(500).send({ response: "could not unlike movie" });
    }
  } else {
    return res.status(404).send({ response: "No id provided" });
  }
});

module.exports = router;
