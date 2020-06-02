import React, { useState, useEffect } from "react";

const PrivateRoute = (ComponentToWrap) => (props) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    //let isFetching = true;
    async function handleAuth() {
      await fetch("http://localhost:9090/api/users/isloggedin", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(res);
        if (res.ok) {
          setIsAuthorized(true);
        }
      });
    }

    handleAuth();
    //return () => (isFetching = false);
  }, []);

  return <ComponentToWrap isAuthorized={isAuthorized} {...props} />;
};

export default PrivateRoute;
