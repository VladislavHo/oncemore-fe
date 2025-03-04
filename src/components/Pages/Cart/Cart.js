import { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { CartContext } from "../../../contexts/CartContext";
import backIcon from "../../../images/caret-left.svg";
import HorizontalItem from "../../HorizontalItem/HorizontalItem";
import { useNavigate } from "react-router";
import { UserContext } from "../../../contexts/UserContext";

export default function Cart(props) {
  function conjugateItem(n) {
    if (n % 10 === 1) 
      return "предмет";
    if (n % 10 > 1 && n % 10 < 5) 
      return "предмета";
    return "предметов";
  }

  function addToTotal(price) {
    setItemTotal(itemTotal + price);
  }

  const cartContext = useContext(CartContext);
  const items = cartContext.cart;
  const amounts = cartContext.cartAmounts;
  const points = useContext(UserContext).user.points;
  const [itemTotal, setItemTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newDiscount = points ? Math.min(itemTotal / 2, points) : 0;
    setDiscount(newDiscount);
    setTotal(itemTotal - newDiscount);
    localStorage.setItem("totalPrice", itemTotal - newDiscount);
    localStorage.setItem("spentPoints", newDiscount);
  }, [itemTotal, points]);

  const navigate = useNavigate();


  return <main className="cart">
    <div className="cart__header">
      <button className="cart__back"
        onClick={() => navigate(-1)}
      >
        <img className="cart__back-icon"
          src={backIcon}
        />
        Назад
      </button>
      <h1 className="cart__title">Корзина</h1>
    </div>
    <div className="cart__main">
      <div className="cart__items">
        <div className="cart__items-header">
          <p className="cart__text">
            В корзине {items.length} {conjugateItem(items.length)}
          </p>
          <button className="cart__clear"
            type="button"
            onClick={props.clearCart}
          >
            Очистить корзину
          </button>
        </div>
        {
          items.map((item, i) => 
            <HorizontalItem
              data={item}
              amount={amounts[i]}
              key={`cart-item-${i}`}
              isCart={true}
              likeItem={props.likeItem}
              addToTotal={addToTotal}
            />
          )
        }
      </div>
      <div className="cart__summary">
        <div className="cart__costs">
          <div className="cart__cost">
            Стоимость товаров
            <span className="cart__price">{itemTotal}₽</span>
          </div>
          <div className="cart__cost cart__cost_discount">
            Скидка
            <span className="cart__price cart__price_discount">
              {discount}₽
            </span>
          </div>
        </div>
        <div className="cart__total">
          Итого
          <span className="cart__total-cost">{total}₽</span>
        </div>
        <button className="cart__checkout-button"
          type="button"
          onClick={() => navigate("/checkout")}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </main>
}