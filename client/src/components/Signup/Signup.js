import React, { useState } from 'react';

export default function Signup() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

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
                <button>Sign up</button>
            </form>
        </div>
    )
}