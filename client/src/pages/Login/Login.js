import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

export default function Login(props) {
    const { setIsAuthenticated } = props;

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
                console.log(res);
                if (res.ok) {
                    setIsAuthenticated(true);
                    history.push("/");
                } else {
                    throw res;
                }
            })
            .catch(error => {
                error.json().then(body => {
                    setError(body.response);
                })
            });
    }

    return (
        <div className="Login">
            <div className="loginSection">
                <h1>Log in</h1>
                <form className="LoginForm">
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={login}>Login</button>
                </form>
                <div>
                    {error ? <p className="error">{error}</p> : ""}
                </div>
                <div>
                    <p>Forgot your password? Reset it here</p>
                </div>
            </div>
        </div>
    )
}