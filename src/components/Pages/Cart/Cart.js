import { useContext, useEffect, useState, useCallback } from "react";
import "./Cart.css";
import { CartContext } from "../../../contexts/CartContext";
import backIcon from "../../../images/caret-left.svg";
import HorizontalItem from "../../HorizontalItem/HorizontalItem";
import { useNavigate } from "react-router";
import { UserContext } from "../../../contexts/UserContext";
import PropTypes from "prop-types";

export default function Cart(props) {
  const { clearCart, likeItem } = props;
  const cartContext = useContext(CartContext);
  const { cart: items, cartAmounts: amounts } = cartContext;
  const { user } = useContext(UserContext);
  const { points } = user;

  const [itemTotal, setItemTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // Функция для склонения слова "предмет"
  const conjugateItem = useCallback((n) => {
    if (n % 10 === 1 && n % 100 !== 11) return "предмет";
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "предмета";
    return "предметов";
  }, []);

  // Функция для обновления итоговой суммы
  const updateTotals = useCallback(() => {
    const newDiscount = points ? Math.min(itemTotal / 2, points) : 0;
    setDiscount(newDiscount);
    setTotal(itemTotal - newDiscount);


    localStorage.setItem("totalPrice", itemTotal - newDiscount);
    localStorage.setItem("spentPoints", newDiscount);
  }, [itemTotal, points]);

  // Эффект для обновления итоговой суммы при изменении itemTotal или points
  useEffect(() => {
    updateTotals();
  }, [updateTotals]);

  useEffect(() => {
    setItemTotal(items.reduce((acc, cur, i) => acc + cur.price, 0 ))

  }, [])
  // Функция для добавления к общей стоимости
  const addToTotal = useCallback((price) => {
    setItemTotal((prevTotal) => prevTotal + price);


  }, []);

  // Функция для очистки корзины
  const handleClearCart = useCallback(() => {
    clearCart();
    setItemTotal(0); // Сброс общей стоимости
  }, [clearCart]);

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <main className="cart">
      <div className="cart__header">
        <button
          className="cart__back"
          onClick={() => navigate(-1)}
          aria-label="Вернуться назад"
        >
          <img className="cart__back-icon" src={backIcon} alt="Назад" />
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
            <button
              className="cart__clear"
              type="button"
              onClick={handleClearCart}
              aria-label="Очистить корзину"
            >
              Очистить корзину
            </button>
          </div>
          {items.length > 0 ? (
            items.map((item, i) => (
              <HorizontalItem
                data={item}
                amount={amounts[i]}
                key={`cart-item-${i}`}
                isCart={true}
                likeItem={likeItem}
                addToTotal={addToTotal}
                deleteItem={() => cartContext.removeFromCart(item._id)}
              />
            ))
          ) : (
            <p className="cart__empty">Ваша корзина пуста</p>
          )}
        </div>
        {items.length > 0 && (
          <div className="cart__summary">
            <div className="cart__costs">
              <div className="cart__cost">
                Стоимость товаров
                <span className="cart__price">{formatPrice(itemTotal)}₽</span>
              </div>
              <div className="cart__cost cart__cost_discount">
                Скидка
                <span className="cart__price cart__price_discount">
                  {formatPrice(discount)}₽
                </span>
              </div>
            </div>
            <div className="cart__total">
              Итого
              <span className="cart__total-cost">{formatPrice(total)}₽</span>
            </div>
            <button
              className="cart__checkout-button"
              type="button"
              onClick={() => navigate("/checkout")}
              aria-label="Оформить заказ"
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

Cart.propTypes = {
  clearCart: PropTypes.func.isRequired,
  likeItem: PropTypes.func.isRequired,
};