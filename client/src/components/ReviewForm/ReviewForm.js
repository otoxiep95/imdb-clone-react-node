import React, { useEffect, useState } from "react";

export default function ReviewForm({ movieId, reviews, setReviews }) {
  const [reviewId, setReviewId] = useState();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState();
  const [content, setContent] = useState("");
  const [hasReview, setHasReview] = useState(false);

  function handleUserHasReview() {
    fetch("http://localhost:9090/api/review/hasreview/" + movieId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          setHasReview(true);
          return res.json();
        } else {
          setHasReview(false);
        }
      })
      .then((data) => {
        if (data) {
          data = data[0];
          console.log(data.title);
          //setUserReview(data);
          setReviewId(data.id);
          setTitle(data.title);
          setRating(data.rating);
          setContent(data.content);
        } else {
          setTitle("");
          setRating(3);
          setContent("");
        }
      });
  }

  function handleUpdateReview() {
    fetch("http://localhost:9090/api/review/" + reviewId, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        rating,
        content,
      }),
    }).then((res) => {
      if (res.ok) {
        setHasReview(true);
      }
    });
  }

  function handleDeleteReview() {
    fetch("http://localhost:9090/api/review/" + reviewId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setHasReview(false);
      }
    });
  }

  function submitReview() {
    fetch("http://localhost:9090/api/review/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        rating,
        content,
        movie_id: movieId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setHasReview(true);
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        let newReviews = [...reviews];
        newReviews.unshift(data.review);
        setReviews(newReviews);
      });
  }

  useEffect(() => {
    handleUserHasReview();
  }, [movieId, hasReview]);

  return (
    <div>
      <form>
        <input
          type="text"
          name="title"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="range"
          name="rating"
          min="1"
          max="5"
          defaultValue="3"
          onChange={(e) => setRating(e.target.value)}
        ></input>
        <textarea
          type="text"
          name="content"
          placeholder="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {hasReview ? (
          <>
            <button onClick={handleUpdateReview}>Update</button>
            <button onClick={handleDeleteReview}>Delete</button>
          </>
        ) : (
          <button type="button" onClick={submitReview}>
            Post
          </button>
        )}
      </form>
    </div>
  );
}
