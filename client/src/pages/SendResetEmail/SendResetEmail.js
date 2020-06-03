import React, { useState } from 'react';
import "./SendResetEmail.css"

export default function SendResetEmail() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    function handleSendResetEmail() {
        fetch('http://localhost:9090/api/users/forgotpassword', {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                        "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(res => {
            if (res.ok) {
                setEmail(email);
                setSuccessMessage('Your e-mail will be recieved shortly with instructions')
            } else {
                throw res;
            }
        })
        .catch(error => {
            error.json().then(body => {
                setError(body.response);
            })
        })
    }

    return (
        <div className="SendResetEmail">
            <div className="loginSection">
                <h1>Reset password</h1>
                <div className="container">
                    <form>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="button" onClick={handleSendResetEmail}>Reset password</button>
                    </form>
                </div>   
                {successMessage ? <p className="error">{successMessage}</p> : ""}
                {error && !successMessage ? <p className="error">{error}</p> : ""}
            </div>
        </div>
    )
}