import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

function AdminRoute(props) {
  const user = useContext(UserContext).user;

  if (user.privilege < 1 || !user.name) {
    return <Navigate to="/" />;
  }
  return <div className="protected-route">{props.children}</div>;
}

export default AdminRoute;
