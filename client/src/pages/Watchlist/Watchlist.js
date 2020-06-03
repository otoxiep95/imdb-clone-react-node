import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { SyncLoader } from "react-spinners";
import "./Watchlist.css";

export default function Watchlist({ keys }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getWatchlist() {
    await fetch("http://localhost:9090/api/watch/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        if (data.length) {
          getWatchlistMovies(data);
        } else {
          setIsLoading(false);
        }
      });
  }

  function getWatchlistMovies(data) {
    data.forEach((watchElement) => {
      const movieId = watchElement.movie_id;

      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keys.apiKey}&language=en-US`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          const watchMovie = { movieData: data, watchLinkId: watchElement.id };
          setMovies((movies) => movies.concat(watchMovie));
          setIsLoading(false);
        });
    });
  }

  useEffect(() => {
    getWatchlist();
  }, []);

  async function handleRemove(id) {
    await fetch("http://localhost:9090/api/watch/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        const index = movies.findIndex((movie) => movie.watchLinkId === id);
        const newMovies = [...movies];
        newMovies.splice(index, 1);
        setMovies(newMovies);
      }
    });
  }

  return (
    <div className="watch-list">
      <h1>Watchlist</h1>
      {!isLoading ? (
        <>
          {!movies.length && <p>You have no movies in your watchlist yet!</p>}
          <div className="watch-list-section">
            {movies &&
              movies.map((movie) => (
                <MovieCard
                  key={movie.movieData.id}
                  movie={movie.movieData}
                  id={movie.watchLinkId}
                  isList={true}
                  handleRemove={handleRemove}
                />
              ))}
          </div>
        </>
      ) : (
        <SyncLoader loading={isLoading} color={"#ffff"} />
      )}
    </div>
  );
}
