import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/Login/Login.js';
import Navbar from './components/Navbar/Navbar.js';
import Signup from './components/Signup/Signup.js';
import Home from './components/Home/Home.js';
import Watchlist from './components/Watchlist/Watchlist.js';
import Profile from './components/Profile/Profile.js';
import './App.css';
import MovieItem from './components/MovieItem/MovieItem.js';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleAuthentication() {
    fetch("http://127.0.0.1:9090/api/users/isloggedin", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      /* console.log(res); */
      if (res.ok) {
        setIsAuthenticated(true);
      }
    })
  }

  useEffect(() => {
    handleAuthentication();
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <header>
          <Navbar />
        </header>
        <main>
          <Switch>
            <Route
              exact path="/"
              component={Home}
            />
            <Route
              path="/profile"
              component={Profile}
            />
            <Route
              path="/watchlist"
              component={Watchlist}
            />
            <Route
              path="/movie/:id"
              component={MovieItem}
            />
            <Route
              path="/login"
              render={() => <Login setIsAuthenticated={setIsAuthenticated} />}
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
