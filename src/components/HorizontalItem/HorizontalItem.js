import { NavLink } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./HorizontalItem.css";

function HorizontalItem(props) {
  const { data, isCart, deleteItem, likeItem, addItem, addToTotal, amount: initialAmount } = props;
  const { photos, name, price, color, stock, _id } = data;

  const [amount, setAmount] = useState(initialAmount);

  // Синхронизация amount с initialAmount
  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

  // Обработчик изменения количества
  const handleAmountChange = useCallback(
    (delta) => (e) => {
      e.stopPropagation();
      e.preventDefault();

      const newAmount = amount + delta;
      if (newAmount < 1 || newAmount > stock) return;

      setAmount(newAmount);
      addToTotal(price * delta);
    },
    [amount, stock, price, addToTotal]
  );

  // Обработчик удаления
  // const handleDelete = useCallback(
  //   (e) => {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     deleteItem
  //   },
  //   []
  // );

  // Обработчик сохранения/добавления в корзину
  const handleSaveOrAdd = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isCart) {
        likeItem(_id);
      } else {
        addItem(e, _id);
      }
    },
    [isCart, likeItem, addItem, _id]
  );

  return (
    <a className="cart-item" href={`/item?id=${_id}`} onClick={(e) => {
      if (e.target.tagName.toLowerCase() === "button") {
        e.preventDefault();
      }
    }}>
      <div className="cart-item__main">
        <img className="cart-item__image" src={photos[0]} alt={name} />
        <div className="cart-item__info">
          <h3 className="cart-item__title">{name}</h3>
          <p className="cart-item__property">Цвет: {color}</p>
        </div>
        <h4 className="cart-item__price">{price}₽</h4>
      </div>
      <div className="cart-item__buttons">
        <button
          className="cart-item__text-button"
          type="button"
          onClick={deleteItem}
          aria-label="Удалить"
        >
          Удалить
        </button>
        {/* <button
          className="cart-item__text-button"
          type="button"
          onClick={handleSaveOrAdd}
          aria-label={isCart ? "Сохранить" : "В корзину"}
        >
          {isCart ? "Сохранить" : "В корзину"}
        </button> */}
        {isCart && (
          <div className="cart-item__number">
            <button
              className="cart-item__num-button cart-item__num-button_minus"
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                e.preventDefault(); 
                handleAmountChange(-1)(e);

              }}
              aria-label="Уменьшить количество"
              disabled={amount <= 1}
            />
            {/* <input
              className="cart-item__input"
              value={amount}
              disabled
              aria-label="Количество"
            /> */}
            <span onClick={(e) => {
              e.stopPropagation();
              e.preventDefault(); 
            }}>{amount}</span>
            <button
              className="cart-item__num-button cart-item__num-button_plus"
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                e.preventDefault(); 
                handleAmountChange(1)(e);

              }}
              aria-label="Увеличить количество"
              disabled={amount >= stock}
            />
          </div>
        )}
      </div>
    </a>
  );
}

HorizontalItem.propTypes = {
  data: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  isCart: PropTypes.bool.isRequired,
  deleteItem: PropTypes.func.isRequired,
  likeItem: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  addToTotal: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
};

export default React.memo(HorizontalItem);

// пароль к админке сайта info@oncemorecosmetics.ru    8ycF9HrM0b