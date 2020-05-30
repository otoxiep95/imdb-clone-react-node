const express = require("express");

const router = express.Router();
const User = require("../../models/User.js");
const Like = require("../../models/Like.js");

router.get("/isLiked/:movieId", async (req, res) => {
  movieId = req.params.movieId;
  if (req.session.user) {
    try {
      const likedMovie = Like.query()
        .where({
          movie_id: movieId,
          user_id: req.session.user.id,
        })
        .limit(1);
      if (likedMovie[0]) {
        return res.status(200).send({ response: "Liked" });
      } else {
        return res.status(404).send({ response: "Not liked" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Something went wrong with the database" });
    }
  } else {
    return res.status(404).send({ response: "not logged in" });
  }
});

//get all liked movies from a user
router.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      const userLikedList = await Like.query().where(
        "user_id",
        req.session.user.id
      );
      return res.json(userLikedList);
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Something went wrong with the database" });
    }
  } else {
    return res.status(404).send({ response: "not logged in" });
  }
});

//post new like
router.post("/", async (req, res) => {
  const { movie_id } = req.body;
  //const movieId = req.params.movieId;
  if (movie_id) {
    if (req.session.user) {
      try {
        const isMovieLiked = await Like.query()
          .where({
            movie_id: movie_id,
            user_id: req.session.user.id,
          })
          .limit(1);
        if (!isMovieLiked[0]) {
          const newLike = await Like.query().insert({
            movie_id,
            user_id: req.session.user.id,
          });
          return res.json(newWatchLink);
        } else {
          return res
            .status(404)
            .send({ response: "You already like this movie" });
        }
      } catch (error) {
        return res
          .status(500)
          .send({ response: "something went wrong in the database", error });
      }
    } else {
      return res.status(404).send({ response: "not logged in" });
    }
  } else {
    return res.status(404).send({ response: "Missing fields" });
  }
});

//Unlike a movie
router.delete("/:id", async (req, res) => {
  likeId = req.params.id;
  if (req.session.user) {
    try {
      await Like.query().deleteById(likeId);
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
