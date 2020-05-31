import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({
  movie,
  isWatchList,
  watchLinkId,
  handleRemove,
}) {
  return (
    <div key={movie.id} className="movie">
      <Link to={"/movie/" + movie.id}>
        <div
          className="poster-container"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`,
          }}
        />{" "}
      </Link>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        {isWatchList && (
          <button onClick={() => handleRemove(watchLinkId)}>Remove</button>
        )}
      </div>
    </div>
  );
}
