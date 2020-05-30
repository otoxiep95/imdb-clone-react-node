import React, { useEffect, useState } from 'react';
import keys from '../../config/keys'
import MovieCard from '../../components/MovieCard/MovieCard';

export default function Watchlist() {
    const [watchlistIds, setWatchlistIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const watchListedMovies = [];

    function getWatchlist() {
        fetch('http://localhost:9090/api/watch/', {
            headers: {
                Accept: "application/json",
                        "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(res => {
            console.log(res)
            if (res.ok) {
                return res.json();
            }
        })
        .then(data => {
            console.log(data)
            setWatchlistIds(data);
            setIsLoading(false);
        })
    }
    {!isLoading && watchlistIds.forEach(id => {
        const movieId = id.movie_id;
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${keys.apiKey}&language=en-US`)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(data => {
            watchListedMovies.push(data);

            /* watchListedMovies.push(data);
            setMovies(watchListedMovies);
            console.log(movies) */
        })
    })}
    
    
    function getWatchlistMovies() {
        console.log("hi")
    }

    useEffect(() => {
        getWatchlist();
        getWatchlistMovies();
    }, []);

    console.log(watchListedMovies)

    return (
        <h1>Watchlist</h1>

    )
}