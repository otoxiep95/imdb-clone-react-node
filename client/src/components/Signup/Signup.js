import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Signup() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const history = useHistory();

    function register() {
        fetch("http://127.0.0.1:9090/api/users/register", {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirm_password: confirmPassword,
            }),
        }).then((res) => {
            console.log(res);
            history.push("/login");
        });
    }

    return (
        <div className="Signup">
            <h1>Sign up</h1>
            <form>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirm password"
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={register}>Sign Up</button>
            </form>
        </div>
    )
}