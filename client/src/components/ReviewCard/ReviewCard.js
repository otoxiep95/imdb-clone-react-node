import React, { useEffect, useState } from "react";

export default function ReviewCard({ review, hasReview }) {
  return (
    <div key={review.id} className="review">
      <h2>{review.title}</h2>
      <p>{review.content}</p>
    </div>
  );
}
