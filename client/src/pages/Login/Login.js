import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  function login() {
    fetch("http://localhost:9090/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
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

  return (
    <div className="Login">
      <div className="loginSection">
        <h1>Log in</h1>
        <div className="container">
          <form className="LoginForm">
            <input
              type="text"
              name="username"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={login}>
              Login
            </button>
          </form>
          <div className="forgot">
            <p>
              Forgot your password? Reset it
              <Link to="/forgotpassword">
                {" "}
                <span>here</span>
              </Link>
            </p>
          </div>
        </div>
        {error ? <p className="error">{error}</p> : ""}
      </div>
    </div>
  );
}
