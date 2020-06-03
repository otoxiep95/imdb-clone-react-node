import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function Logout({ setIsAuthenticated }) {
  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:9090/api/users/logout", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setIsAuthenticated(false);
        history.push("/");
      }
    });
  }, [history]);

  return <></>;
}
