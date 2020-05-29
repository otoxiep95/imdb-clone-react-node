const express = require("express");

const router = express.Router();
const User = require("../../models/User.js");
const Review = require("../../models/Review.js");

//get all reviews for movie
router.get("/:movieId/", async (req, res) => {
  movieId = req.param.movieId;
  const movieReviews = Review.query().where("movie_id", movieId);
  res.json(movieReviews);
});

router.get("/userhasreview/:movieId/", async (req, res) => {
  movieId = req.param.movieId;
  const hasReview = await Review.query().where({
    user_id: req.session.user.id,
    movie_id: movie_id,
  });
  if (!hasReview) {
    res.status(200).send({ response: "No review yet" });
  } else {
    res.status(400).send({ response: "Already has review" });
  }
});

//post new review
router.post("/", async (req, res) => {
  const { title, rating, content, movie_id } = req.body;
  if (title && rating && content && movie_id) {
    //validation?
    if (title.length > 100 || content.length > 280) {
      res.status(400).send({ response: "Title or review are too long" });
    } else {
      try {
        const existingReview = await Review.query().where({
          user_id: req.session.user.id,
          movie_id: movie_id,
        });
        if (!existingReview) {
          const newReview = await Review.query().insert({
            rating,
            title,
            content,
            user_id: req.session.user.id,
            movie_id,
          });
        } else {
          res.status(404).send({ response: "You already have a review" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ response: "Something went wrong with the database" });
      }
    }
  } else {
    res.status(404).send({ response: "Missing fields" });
  }
});


// Export to api.js
module.exports = router;
