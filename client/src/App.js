import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import keys from '../src/config/keys.js'
import Login from './components/Login/Login.js';
import './App.css';
import Navbar from './components/Navbar/Navbar.js';
import Signup from './components/Signup/Signup.js';
import Home from './components/Home/Home.js';

export default function App() {

  const [movie, setMovie] = useState("");

  function fetchMovies() {
    fetch(`https://api.themoviedb.org/3/movie/550?api_key=${keys.apiKey}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(data => {
        console.log(data);
        setMovie(data);
      })
  }

  useEffect(() => {
    fetchMovies();
  }, []);
  
/*   const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}` */
  return (
    <Router>
      <div className="App">
        <header>
            <Navbar/>
        </header>
        <main>
          <Switch>
            <Route 
              exact path="/" 
              component={Home} 
            />
            <Route 
              path="/login" 
              component={Login} 
            />
            <Route 
              path="/signup" 
              component={Signup} 
            />
          </Switch>    
        </main>
      </div>
    </Router>
  );
}
