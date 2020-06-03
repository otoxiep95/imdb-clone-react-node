import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { SyncLoader } from "react-spinners";
import "./SearchResult.css";

export default function SearchResult({ keys, match }) {
  const [movieResults, setMovieResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const query = match.params.query;

  function fetchResults() {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${keys.apiKey}&language=en-US&query=${query}&page=1`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setMovieResults(data.results);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="SearchResult">
      <h1>Results for "{query}"</h1>
      {!isLoading ? (
        <div className="search-list">
          {movieResults &&
            movieResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} search={true} />
            ))}
        </div>
      ) : (
        <SyncLoader loading={isLoading} color={"#ffff"} />
      )}
    </div>
  );
}
