import { useContext } from "react";
import "./DropdownMenu.css";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

export default function DropdownMenu(props) {
  const user = useContext(UserContext).user;

  return (
    <div className="dropdown">
      <div className={`dropdown__links ${
        props.isOpen ? "dropdown__links_visible" : ""
      }`}>
      {
        props.links.map((link, i) => 
          {
            return link.link != "/admin" || user.privilege >= 1 ?
            <NavLink className="dropdown__link"
              key={`dropdown-category-$${i}`}
              to={link.link}
            >
              {link.name}
            </NavLink> : ""
          }
        )
      }
      </div>
    </div>
  );
}