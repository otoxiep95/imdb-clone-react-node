import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

export default function Profile(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const history = useHistory();
    const {
        setIsAuthenticated
    } = props;

    useEffect(() => {
        fetch("http://localhost:9090/api/users", {
            credentials: "include",
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setUsername(data.username);
                setEmail(data.email);
                setIsLoading(false);
            });
    }, []);

    function deleteUser() {
        fetch("http://localhost:9090/api/users", {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    setIsAuthenticated(false);
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
        <div className="profile-container">
            {!isLoading ? (
                <>
                    <h1>Name: {username}</h1>
                    <h1>Email: {email}</h1>
                    <button type="button" onClick={deleteUser}>Delete user</button>
                </>
            ) : (
                    <p>Loading movies...</p>
                )}
        </div>
    );
}