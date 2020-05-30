import React, { useState, useEffect } from "react";

export default function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetch("http://localhost:9090/api/users", {
            credentials: "include",
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setUsername(data.username);
                setEmail(data.email);
            });
    }, []);

    return (
        <div className="profile-container">
            <h1>Name: {username}</h1>
            <h1>Email: {email}</h1>
        </div>
    );
}