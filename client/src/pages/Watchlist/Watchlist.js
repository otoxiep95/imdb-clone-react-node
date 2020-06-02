import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import './Watchlist.css';

export default function Watchlist({ keys }) {
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [movies, setMovies] = useState([]);

  async function getWatchlist() {
    await fetch("http://localhost:9090/api/watch/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        setWatchlistIds(data);
        //setIsLoading(false);

        getWatchlistMovies(data);
      });
  }

  function getWatchlistMovies(data) {
    console.log(data);

    data.forEach((watchElement) => {
      const movieId = watchElement.movie_id;
      console.log(watchElement);
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keys.apiKey}&language=en-US`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
          //watchListedMovies.push(data);
          const watchMovie = { movieData: data, watchLinkId: watchElement.id };
          setMovies((movies) => movies.concat(watchMovie));
          console.log(movies);
        });
    });
  }

  useEffect(() => {
    getWatchlist();
  }, []);

  async function handleRemove(id) {
    console.log("delete:" + id);
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
  //console.log(watchListedMovies);

  return (
    <div>
      <div className="watch-list">
        <h1>Watchlist</h1>
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
      </div>
    </div>
  );
}
