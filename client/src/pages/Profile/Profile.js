import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import { SyncLoader } from "react-spinners";
import "./Profile.css";

export default function Profile({ keys, setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [movies, setMovies] = useState([]);

  const history = useHistory();

  function getUserInfo() {
    fetch("http://localhost:9090/api/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsername(data.username);
        setEmail(data.email);
        setIsLoading(false);
      });
  }

  function deleteUser() {
    fetch("http://localhost:9090/api/users", {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          setIsAuthenticated(false);
          history.push("/");
        } else {
          throw res;
        }
      })
      .catch((error) => {
        error.json().then((body) => {
          setError(body.response);
        });
      });
  }

  async function getFavorites() {
    await fetch("http://localhost:9090/api/liked/", {
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
        setFavoriteIds(data);
        getFavoriteMovies(data);
      });
  }

  function getFavoriteMovies(data) {
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
          const watchMovie = { movieData: data, likeId: watchElement.id };
          setMovies((movies) => movies.concat(watchMovie));
          console.log(movies);
        });
    });
  }

  async function handleRemove(id) {
    console.log("unlike" + id);
    await fetch("http://localhost:9090/api/liked/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        const index = movies.findIndex((movie) => movie.likeId === id);
        const newMovies = [...movies];
        newMovies.splice(index, 1);
        setMovies(newMovies);
      }
    });
  }

  useEffect(() => {
    getUserInfo();
    getFavorites();
  }, []);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {!isLoading ? (
        <>
          <div className="profile-details">
            <h2>Name: {username}</h2>
            <h2>Email: {email}</h2>
            <button
              type="button"
              className="delete-button"
              onClick={deleteUser}
            >
              Delete user
            </button>
          </div>
          <h1>Favorites</h1>
          {!movies.length && <p>You have no favorites yet</p>}
          <div className="favorite-list">
            {movies &&
              movies.map((movie) => (
                <MovieCard
                  key={movie.movieData.id}
                  movie={movie.movieData}
                  id={movie.likeId}
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
