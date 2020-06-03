import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import noPoster from "../../images/no-poster.png";
import Review from "../../components/Review/Review";
import { SyncLoader } from "react-spinners";
import heart from "../../images/heart.svg"
import bookmark from "../../images/watchlist.svg"
import bookmarkFilled from "../../images/watchlist-filled.svg"
import heartFilled from "../../images/heart-filled.svg"
import "./MovieItem.css";

export default function MovieItem(props) {
  const { isAuthenticated, keys } = props;
  const [movie, setMovie] = useState();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [isInFavorite, setIsInFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  /*   const [userReview, setUserReview] = useState({}); */

  const history = useHistory();

  function fetchMovieById() {
    const movieId = props.match.params.id;
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keys.apiKey}&language=en-US`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return history.push("/");
        }
      })
      .then((data) => {
        if (data) {
          data.year = Number(data.release_date.split("-", 1)[0]);
          setMovie(data);
          fetchSimilarMovies(movieId);
          setIsLoading(false);
        }
      });
  }

  function fetchSimilarMovies(movieId) {
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
    fetch("http://localhost:9090/api/liked/isLiked/" + movieId, {
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

  useEffect(() => {
    fetchMovieById();
    /* fetchSimilarMovies(); */
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
                    alt="Movie poster"
                  />
                ) : (
                  <img src={noPoster} alt="Movie poster" />
                )}
              </div>
              <div>
                <h1>
                  {movie.title} ({movie.year})
                </h1>
                {isAuthenticated && (
                  <div className="movie-buttons">
                    {isInWatchList ? (
                      <div className="like-container">
                        <img src={bookmarkFilled}></img>
                        <span>Already in watchlist</span>
                      </div>
                    ) : (
                      <div onClick={addToWatchList} className="like-container">
                        <img src={bookmark}></img>
                        <span>Watchlist</span>
                      </div>
                    )}

                    {isInFavorite ? (
                      <div className="like-container">
                        <img src={heartFilled}></img>
                        <span>Already liked</span>
                      </div>  
                    ) : (
                      <div onClick={addToFavorites} className="like-container">
                        <img src={heart}></img>
                        <span>Like</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="movie-general">
                  <p>{movie.release_date} (US)</p>
                  {movie.genres.map(function (genre, index) {
                    return (
                      <span key={genre.id}>
                        {(index ? ", " : "") + genre.name}
                      </span>
                    );
                  })}
                </div>
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
