import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./ResetPassword.css";

export default function ResetPassword(props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const history = useHistory();

  function handlePasswordReset() {
    fetch("http://localhost:9090/api/users/passwordreset", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.match.params.id,
        recoveryLink: props.match.params.link,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setSuccessMessage("Successfully updated password");
          setTimeout(() => {
            history.push("/login");
          }, 2000);
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
    <div className="ResetPassword">
      <div className="loginSection">
        <h1>Reset password</h1>
        <div className="container">
          <form>
            <input
              type="password"
              placeholder="New password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="button" onClick={handlePasswordReset}>
              Update password
            </button>
          </form>
        </div>
        {successMessage ? <p className="error">{successMessage}</p> : ""}
        {error && !successMessage ? <p className="error">{error}</p> : ""}
      </div>
    </div>
  );
}
