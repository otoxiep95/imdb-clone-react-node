import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login(props) {
    const { setIsAuthenticated } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    function login() {
        fetch("http://127.0.0.1:9090/api/users/login", {
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
            <h1>Log in</h1>
            <form>
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
                <p>Forgot your password? Reset it here</p>
            </div>
            <div>
                {error ? <p className="error">{error}</p> : ""}
            </div>
        </div>
    )
}