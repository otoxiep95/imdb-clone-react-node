import React, { useEffect, useState } from "react";

export default function ReviewForm({ movieId }) {
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

  function handleUpdateReview() {}

  function handleDeleteReview() {}

  function submitReview() {
    console.log("Hello");
  }

  useEffect(() => {
    handleUserHasReview();
  }, []);

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
          value="3"
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
            <button>Delete</button>
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
