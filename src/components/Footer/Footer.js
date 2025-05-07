import { Link, NavLink, useLocation } from "react-router-dom";
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
          <a className="footer__link" href="/contract">
            ДОГОВОР ОФЕРТА
          </a>
          {/* <NavLink className="footer__link" to="/confidentiality">
            ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
          </NavLink> */}
          <a className="footer__link" href="/confidentiality">
            ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
          </a>
          <a className="footer__link" href="/personal-data">
            ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
          </a>
        </div>
        <div className="footer__contacts">
          <h2 className="footer__title">
            КОНТАКТНАЯ ИНФОРМАЦИЯ
          </h2>
          <div className="footer__socials">
            {
              props.contacts.map((social, i) => (
                <a className="footer__social-link"
                  href={social.link}
                  key={`social-${i}`}
                >
                  <img className="footer__social-icon"
                    src={social.icon}
                  />
                </a>
              ))
            }
          </div>
        </div>
      </div>
    </footer>
  );
}