import { NavLink } from "react-router-dom";
import logoutWhite from "../../images/logout white.svg";
import "./MobileMenu.css";
import cart from "../../images/icon _shopping cart.svg";
import { useContext, useState } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import { UserContext } from "../../contexts/UserContext";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

function MobileMenu(props) {
  function openLoginModal() {
    props.setMenuOpen(false);
    props.openLoginModal();
  }

  const { isLoggedIn } = props;
  const [userOpen, setUserOpen] = useState(false);
  const userData = useContext(UserContext).user;

  return (
    <div className={`menu ${props.isMenuOpen ? " menu__opened" : ""}`}>
      <div className="menu__container">
        <div className="menu__header">
          <h1 className="header__logo">OnceMore</h1>
          <button
            className="menu__close-button"
            onClick={() => props.setMenuOpen(false)}
          />
        </div>
        <div className="menu__main">
          <nav className="menu__nav">
            <NavLink
              className="menu__link"
              to="/cart"
              onClick={() => props.setMenuOpen(false)}
            >
              <img className="menu__icon"
                src={cart}
              />
              Корзина
            </NavLink>
            <NavLink
              className="menu__link"
              to="/"
              onClick={() => props.setMenuOpen(false)}
            >
              Главная
            </NavLink>
            <div className="menu__categories">
            {
              props.categories.map((category, i) => (
                <NavLink className="menu__link"
                  to={category.link}
                  key={`category-${i}`}
                  onClick={() => props.setMenuOpen(false)}
                >
                  {category.name}
                </NavLink>
              ))
            }
            </div>
          </nav>
          {isLoggedIn ? (
            <button className="menu__button"
            type="button"
            onClick={() => setUserOpen(!userOpen)}
            >
              <UserAvatar
                userData={userData}
              />
              <div className="menu__user-info">
                <p className="header__link-title">{userData.name}</p>
              </div>
              <div className="menu__dropdown">
                <DropdownMenu
                  links={props.userLinks}
                  isOpen={userOpen}
                />
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="menu__button"
              onClick={openLoginModal}
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
