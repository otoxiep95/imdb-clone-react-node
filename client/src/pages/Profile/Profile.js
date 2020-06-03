import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import { SyncLoader } from "react-spinners";
import "./Profile.css";

export default function Profile({ keys, setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const history = useHistory();

  function getUserInfo() {
    fetch("http://localhost:9090/api/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
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
    }).then((res) => {
      if (res.ok) {
        setIsAuthenticated(false);
        history.push("/");
      } else {
        throw res;
      }
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
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        getFavoriteMovies(data);
      });
  }

  function getFavoriteMovies(data) {
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
          const watchMovie = { movieData: data, likeId: watchElement.id };
          setMovies((movies) => movies.concat(watchMovie));
        });
    });
  }

  async function handleRemove(id) {
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
