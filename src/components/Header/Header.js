import { NavLink, useLocation } from "react-router-dom";
import Search from "../Search/Search";
import "./Header.css";

import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useContext, useState } from "react";

import { UserContext } from "../../contexts/UserContext";
import UserAvatar from "../UserAvatar/UserAvatar";
import icon from "../../images/grid-2.svg"
import logo from "../../images/oncemore_logo.svg";

export default function Header(props) {
  const currentPath = useLocation().pathname;

  const userData = useContext(UserContext).user;


  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  
  if (props.isOnMobile) {
    return(
      <header className="header">
        <button
          className={
            "header__menu-button"
          }
          onClick={() => props.setMenuOpen(true)}
        />
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header__top">
        <NavLink className="header__link" to="/">
          <img className="footer__logo"
            src={logo}
            alt="OnceMore"
          />
        </NavLink>
        <div className="header__dropdown">
          <button className={`dropdown__button ${
              categoriesOpen ? "dropdown__button_open" : ""
            }`}
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            <img className="dropdown__icon"
              src={icon}
            />
            Категории
            <DropdownMenu
              links={props.categories}
              isOpen={categoriesOpen}
            />
          </button>
        </div>
        <Search/>
        <nav className="header__menu">
          {props.isLoggedIn ? 
          (
            <div className="header__links">
              <div className="header__link">
                <button className="header__user"
                  type="button"
                  onClick={() => setUserOpen(!userOpen)}
                >
                  <UserAvatar
                    userData={userData}
                  />
                  <div className="header__user-info">
                    <p className="header__link-title">{userData.name}</p>
                    <p className="header__subtitle">Аккаунт</p>
                  </div>
                  <div className="header__dropdown">
                    <DropdownMenu
                      links={props.userLinks}
                      isOpen={userOpen}
                    />
                  </div>
                </button>
              </div>

            </div>
          ) : (
            <div className="header__links">
              <button className="header__button"
                onClick={() => props.handleModalOpen("login")}
              >
                Вход
              </button>
            </div>            
          )}


        </nav>
      </div>
      {
        currentPath === "/review"
        ? "" :
        <div className="header__categories">
        {
          props.categories.map((category, i) => (
            <NavLink className="header__category"
              to={category.link}
              key={`category-${i}`}
            >
              {category.name}
            </NavLink>
          ))
        }
        </div>
      }
    </header>
  );
}