import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login/Login.js";
import Navbar from "./components/Navbar/Navbar.js";
import Signup from "./pages/Signup/Signup.js";
import Home from "./pages/Home/Home.js";
import Watchlist from "./pages/Watchlist/Watchlist.js";
import Profile from "./pages/Profile/Profile.js";
import MovieItem from "./pages/MovieItem/MovieItem.js";
import Logout from "./components/Logout/Logout.js";
import SearchResult from "./pages/SearchResult/SearchResult.js";
import SendResetEmail from "./pages/SendResetEmail/SendResetEmail.js";
import ResetPassword from "./pages/ResetPassword/ResetPassword.js";
import keys from "../src/config/keys";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleAuthentication() {
    fetch("http://localhost:9090/api/users/isloggedin", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        setIsAuthenticated(true);
      }
    });
  }

  useEffect(() => {
    handleAuthentication();
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <header>
          <Navbar isAuthenticated={isAuthenticated} />
        </header>
        <main>
          <Switch>
            <Route 
              exact path="/" 
              render={() => <Home keys={keys} />} 
            />
            <Route
              path="/profile"
              render={() => (
                <Profile keys={keys} setIsAuthenticated={setIsAuthenticated} />
              )}
            />
            <Route 
              path="/watchlist" 
              render={() => <Watchlist keys={keys} />} 
            />
            <Route
              path="/movie/:id"
              render={(props) => (
                <MovieItem
                  {...props}
                  keys={keys}
                  isAuthenticated={isAuthenticated}
                />
              )}
            />
            <Route
              path="/search/:query"
              render={(props) => <SearchResult {...props} keys={keys} />}
            />
            <Route
              path="/login"
              render={() => <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route 
              path="/signup" 
              component={Signup} 
            />
            <Route 
              path="/forgotpassword" 
              component={SendResetEmail} 
            />
            <Route 
              path="/passwordreset/:id/:link" 
              component={ResetPassword} 
            />
            <Route
              path="/logout"
              render={() => <Logout setIsAuthenticated={setIsAuthenticated} />}
            />
          </Switch>
        </main>
      </div>
    </Router>
  );
}
