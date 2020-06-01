import React, { useState, useEffect } from "react";
import keys from "../../config/keys";
import "./MovieItem.css";
import MovieCard from "../../components/MovieCard/MovieCard";
import noPoster from "../../images/no-poster.png";
import Review from "../../components/Review/Review";
import { SyncLoader } from "react-spinners";

export default function MovieItem(props) {
  const { isAuthenticated } = props;
  const [movie, setMovie] = useState();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [isInFavorite, setIsInFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({});

  function fetchMovieById() {
    const movieId = props.match.params.id;
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keys.apiKey}&language=en-US`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        data.year = Number(data.release_date.split("-", 1)[0]);
        setMovie(data);
        setIsLoading(false);
      });
  }

  function fetchSimilarMovies() {
    const movieId = props.match.params.id;
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${keys.apiKey}&language=en-US&page=1`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setSimilarMovies(data.results);
      });
  }

  function handleIsInWatchList() {
    const movieId = props.match.params.id;
    fetch("http://localhost:9090/api/watch/hasWatchLink/" + movieId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setIsInWatchList(true);
      } else {
        setIsInWatchList(false);
      }
    });
  }

  function handleIsInFavorites() {
    const movieId = props.match.params.id;
    fetch("http://localhost:9090/api/watch/isLiked/" + movieId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setIsInFavorite(true);
      } else {
        setIsInFavorite(false);
      }
    });
  }

  function addToWatchList() {
    const movieId = props.match.params.id;
    fetch("http://localhost:9090/api/watch/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movie_id: movieId,
      }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchList(true);
      }
    });
  }

  function addToFavorites() {
    const movieId = props.match.params.id;
    fetch("http://localhost:9090/api/liked/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movie_id: movieId,
      }),
    }).then((res) => {
      if (res.ok) {
        setIsInFavorite(true);
      }
    });
  }

  function getAllReviews() {
    const movieId = props.match.params.id;
    fetch("http://localhost:9090/api/review/" + movieId, {
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
        setReviews(data);
      });
  }

  function postReview() {}

  useEffect(() => {
    fetchMovieById();
    fetchSimilarMovies();
    handleIsInWatchList();
    handleIsInFavorites();
    getAllReviews();
    //handleUserHasReview();
  }, [props.location]);

  return (
    <div className="MovieItem">
      {!isLoading ? (
        <>
          <div
            className="movie-header"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.backdrop_path})`,
            }}
          >
            <div className="inner-movie-header">
              <div className="poster">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  />
                ) : (
                  <img src={noPoster} />
                )}
              </div>
              <div>
                <h1>
                  {movie.title} ({movie.year})
                </h1>
                {isAuthenticated &&
                  <>
                    {isInWatchList ? (
                      <div>Already in watchlist</div>
                    ) : (
                      <button type="button" onClick={addToWatchList}>
                        Watchlist
                      </button>
                    )}

                    {isInFavorite ? (
                      <div>Already in favorites</div>
                    ) : (
                      <button type="button" onClick={addToFavorites}>
                        Like
                      </button>
                    )}
                  </>
                }
                <p>{movie.release_date} (US)</p>
                {movie.genres.map(function (genre, index) {
                  return (
                    <span key={genre.id}>
                      {(index ? ", " : "") + genre.name}
                    </span>
                  );
                })}
                <p>{movie.overview}</p>
              </div>
            </div>
          </div>
          <div className="reviews">
            <Review isAuthenticated={isAuthenticated} movie={movie} />
          </div>
          <div className="similar">
            {similarMovies.length ? <h2>Similar movies</h2> : ""}
            <div className="movie-list similar">
              {similarMovies &&
                similarMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    id={""}
                    isList={false}
                    handleRemove={false}
                  />
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="inner-movie-header">
          <div className="loader">
            <SyncLoader loading={isLoading} color={"#ffff"} />
          </div>
        </div>
      )}
    </div>
  );
}
