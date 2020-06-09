import React from "react";
import "./ReviewCard.css";

export default function ReviewCard({ review }) {
  const reviewPosted = new Date(review.created_at);
  const formattedDate = reviewPosted.toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div key={review.id} className="ReviewCard">
      <div className="review-header">
        <h3>{review.title}</h3>
        <span>{review.rating} stars</span>
      </div>
      <div className="review-info">
        <p>{formattedDate}</p>
        <p>Posted by: {review.user.username} </p>
      </div>
      <p>{review.content}</p>
    </div>
  );
}
