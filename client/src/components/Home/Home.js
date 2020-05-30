import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import keys from '../../config/keys';
import inception from '../../images/inception.png'
import './Home.css';

export default function Home() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function fetchPopularMovies() {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${keys.apiKey}&language=en-US&page=1`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(data => {
          /* console.log(data); */
          setPopularMovies(data.results);
          setIsLoading(false);
        })
    }

    function fetchTopRatedMovies() {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${keys.apiKey}&language=en-US&page=1&region=US`)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
          })
          .then(data => {
            /* console.log(data); */
            setTopRatedMovies(data.results);
            setIsLoading(false);
          })
    }

    function fetchUpcomingMovies() {
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${keys.apiKey}&language=en-US&page=1`)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
          })
          .then(data => {
            /* console.log(data); */
            setUpcomingMovies(data.results);
            setIsLoading(false);
          })
    }

    useEffect(() => {
        fetchPopularMovies();
        fetchTopRatedMovies();
        fetchUpcomingMovies();
      }, []);

    return (
        <div className="Home">
          <div className="home-header" style={{ backgroundImage: `url(${inception})` }}>
            <div className="inner-home-header">
              <div>
                <h1>Welcome.</h1>
                <p>Explore movies now.</p>
              </div>
              <div>
                <form>
                  <input type="text" name="search" placeholder="search for a movie"/>
                  <button>Search</button>
                </form>
              </div>
            </div>
          </div>

            {! isLoading ? (
                <>
                    <h2>Popular</h2>
                    <div className="movie-list popular">
                      {popularMovies && popularMovies.map(movie => (
                        <div key={movie.id} className="movie">
                          <Link to={"/movie/" + movie.id}>  
                            <div className="poster-container" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})` }}/>
                            <div className="movie-info">
                              <h3>{movie.title}</h3>
                              <button>Watchlist</button>
                              <button>Favorite</button>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    <h2>Top rated</h2>
                    <div className="movie-list top-rated">
                        {topRatedMovies && topRatedMovies.map(movie => (
                            <div key={movie.id} className="movie">
                                <Link to={"/movie/" + movie.id}> 
                                    <div className="poster-container" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})` }}/>
                                    <div className="movie-info">
                                      <h3>{movie.title}</h3>
                                      <button>Watchlist</button>
                                      <button>Favorite</button>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <h2>Upcoming</h2>
                    <div className="movie-list upcoming">
                        {upcomingMovies && upcomingMovies.map(movie => (
                            <div key={movie.id} className="movie">
                                <Link to={"/movie/" + movie.id}> 
                                    <div className="poster-container" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})` }}/>
                                    <div className="movie-info">
                                      <h3>{movie.title}</h3>
                                      <button>Watchlist</button>
                                      <button>Favorite</button>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading movies...</p>
            )}
        </div>
    )
}