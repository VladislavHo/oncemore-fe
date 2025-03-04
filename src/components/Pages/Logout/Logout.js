import { Navigate } from "react-router"

export default function Logout(props) {
  props.logOut();

  return <Navigate to="/"></Navigate>
}