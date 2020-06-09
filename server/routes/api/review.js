const express = require("express");
const router = express.Router();
const Review = require("../../models/Review.js");


//get all reviews for movie 
router.get("/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;
  const movieReviews = await Review.query()
    .where("movie_id", movieId)
    .withGraphFetched("user");
  return res.json(movieReviews);
});

//get all reviews from user 
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  const { id } = req.session.user;
  const reviews = await Review.query().where({ user_id: id });

  return res.json(reviews);
});

//check if user has review
router.get("/hasreview/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (movieId) {
    const hasReview = await Review.query()
      .where({
        user_id: req.session.user.id,
        movie_id: movieId,
      })
      .limit(1);

    if (!hasReview[0]) {
      return res.status(404).send({ response: "No review yet" });
    } else {
      return res.json(hasReview);
    }
  } else {
    return res.status(404).send({ response: "No movie id" });
  }
});

//post new review 
router.post("/", async (req, res) => {
  const { title, rating, content, movie_id } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (movie_id) {
    if (!title || !rating || !content) {
      return res.status(400).send({ response: "Missing fields" });
    }

    if (title.length > 100 || content.length > 280) {
      return res.status(400).send({ response: "Title or review are too long" });
    }

    try {
      const existingReview = await Review.query()
        .where({
          user_id: req.session.user.id,
          movie_id: movie_id,
        })
        .limit(1);

      if (!existingReview[0]) {
        const newReview = await Review.query().insert({
          rating,
          title,
          content,
          user_id: req.session.user.id,
          movie_id,
        }).withGraphFetched("user");

        return res.send({ response: "Review posted", review: newReview });
      } else {
        return res
          .status(404)
          .send({ response: "You already have a review for this movie" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Something went wrong with the database" });
    }
  } else {
    res.status(404).send({ response: "No movie id" });
  }
});

//Update review
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { rating, title, content } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  if (!title || !rating || !content) {
    return res.status(400).send({ response: "Missing fields" });
  }

  if (title.length > 100 || content.length > 280) {
    return res.status(400).send({ response: "Title or review are too long" });
  }

  try {
    const existingReview = await Review.query().where({ id }).limit(1);
    if (!existingReview[0]) {
      return res
        .status(404)
        .send({ response: "review with this id does not exist" });
    } else {
      const review = await Review.query().findById(id).patch({
        id,
        rating,
        title,
        content,
      });
      return res.json(review);
    }
  } catch (error) {
    return res.status(500).send({ response: "could not update review" });
  }
});

//delete review
router.delete("/:id", async (req, res) => {
  const reviewId = req.params.id;

  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  try {
    const reviewToDelete = await Review.query().deleteById(reviewId);
    return res.send({
      response: "successfully deleted review",
      review: reviewToDelete,
    });
  } catch (error) {
    return res.status(500).send({ response: "review could not be deleted" });
  }
});

module.exports = router;
