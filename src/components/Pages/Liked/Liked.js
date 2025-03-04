import { useContext } from "react";
import "./Liked.css";
import { UserContext } from "../../../contexts/UserContext";
import HorizontalItem from "../../HorizontalItem/HorizontalItem";
import backIcon from "../../../images/caret-left.svg";
import { useNavigate } from "react-router";

export default function Liked(props) {
  const user = useContext(UserContext).user;
  const items = props.items.filter(
    (item) => item.likes.includes(user._id));
  
    const navigate = useNavigate();


  if (!props.isLoggedIn || !user) {
    return (
      <main className="liked">
        <h2 className="liked__register">
          <button className="liked__signup-button"
            onClick={props.openSignUp}
          >
            Зарегистрируйтесь
          </button>
          , чтобы сохранять товары и участвовать в сообществе OnceMore!
        </h2>
      </main>
    );
  }

  return (
    <main className="liked">
    <div className="cart__header">
      <button class="cart__back"
        onClick={() => navigate(-1)}
      >
        <img className="cart__back-icon"
          src={backIcon}
        />
        Назад
      </button>
      <h1 className="cart__title">Сохранённое</h1>
    </div>
      <div className="liked__items">
        {
          items.map((item, i) => 
            <HorizontalItem
              isWide={true}
              data={item}
              key={`cart-item-${i}`}
              isCart={false}
              addItem={props.addItem}
            />
          )
        }
      </div>
    </main>
  );
}