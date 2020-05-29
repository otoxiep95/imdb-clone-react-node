import React from 'react';
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
