import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="Navbar">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" activeClassName="selected">
                            Home
                        </NavLink>
                    </li>
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
                </ul>
            </nav>
        </div>
    )
}