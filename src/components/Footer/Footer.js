import { NavLink, useLocation } from "react-router-dom";
import "./Footer.css";
import logo from "../../images/oncemore_logo.svg";

export default function Footer(props) {
  const currentPath = useLocation().pathname;

  if (currentPath === "/review") return;

  return (
    <footer className="footer">
      <img className="footer__logo"
        src={logo}
        alt="OnceMore"
      />
      <div className="footer__info">
        <div className="footer__legal">
          <NavLink className="footer__link" to="/contract">
            ДОГОВОР ОФЕРТА123
          </NavLink>
          <NavLink className="footer__link" to="/confidentiality">
            ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
          </NavLink>
          <NavLink className="footer__link" to="/personal-data">
            ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
          </NavLink>
        </div>
        <div className="footer__contacts">
          <h2 className="footer__title">
            КОНТАКТНАЯ ИНФОРМАЦИЯ
          </h2>
          <div className="footer__socials">
            {
              props.contacts.map((social, i) => (
                <NavLink className="footer__social-link" 
                  to={social.link}
                  key={`social-${i}`}
                >
                  <img className="footer__social-icon"
                    src={social.icon}
                  />
                </NavLink>
              ))
            }
          </div>
        </div>
      </div>
    </footer>
  );
}