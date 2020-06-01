import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'
import Logout from '../Logout/Logout';

export default function Navbar(props) {

    const {
        isAuthenticated,
        setIsAuthenticated
    } = props;

    return (
        <div className={isAuthenticated ? "Navbar auth" : "Navbar"}>
            <nav>
                <ul>
                    <li>
                        Logo
                    </li>
                    <li>
                        <NavLink exact to="/" activeClassName="selected">
                            Home
                        </NavLink>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <NavLink to="/profile" activeClassName="selected">
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/watchlist" activeClassName="selected">
                                    Watchlist
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/logout" activeClassName="selected">
                                    Log out
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login" activeClassName="selected">
                                    Log in
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/signup" activeClassName="selected">
                                    Sign up
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    )
}