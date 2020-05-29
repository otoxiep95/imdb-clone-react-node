import React, { useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                <button>Log in</button>
            </form>
            <div>
                <p>Forgot your password? Reset it here</p>
            </div>
        </div>
    )
}