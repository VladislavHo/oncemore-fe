import { NavLink } from "react-router-dom";
import "./HorizontalItem.css";
import { useEffect, useState } from "react";

export default function HorizontalItem(props) {
  function increaseAmount(e) {
    e.stopPropagation();
    e.preventDefault();

    if (amount >= stock)
      return;

    setAmount(amount + 1);
    props.addToTotal(price);
  }
  function decreaseAmount(e) {
    e.stopPropagation();
    e.preventDefault();

    props.addToTotal(-price);
    if (amount == 1) {
      props.deleteItem();
      return;
    }
    setAmount(amount - 1);
  }


  const { photos, name, price, color, stock, _id } = props.data;
  const { isCart } = props;
  const [amount, setAmount] = useState(props.amount);
  useEffect(() => props.addToTotal(price), [])

  return (
    <NavLink className="cart-item" to={`/item?id=${_id}`}>
      <div className="cart-item__main">
        <img className="cart-item__image"
          src={photos[0]}
          alt={name}
        />
        <div className="cart-item__info">
          <h3 className="cart-item__title">{name}</h3>
          <p className="cart-item__property">Цвет: {color}</p>
        </div>
        <h4 className="cart-item__price">{price}₽</h4>
      </div>
      <div className="cart-item__buttons">
        <button className="cart-item__text-button"
          type="button"
          onClick={props.deleteItem}
        >
          Удалить
        </button>
        <button className="cart-item__text-button"
          type="button"
          onClick={
            isCart ? (e) => {
              e.stopPropagation();
              e.preventDefault();
              props.likeItem(_id)
            } :
            (e) => {
              props.addItem(e, _id)
            }
          }
        >
          {isCart ? "Сохранить" : "В корзину"}
        </button>
        {isCart ? 
          <div className="cart-item__number">
            <button 
              className="cart-item__num-button cart-item__num-button_minus"
              type="button"
              onClick={(e) => decreaseAmount(e)}
            />
            <input className="cart-item__input"
              value={amount}
              disabled
            />
            <button 
              className="cart-item__num-button cart-item__num-button_plus"
              type="button"
              onClick={(e) => increaseAmount(e)}
            />
          </div>
          : ""
        }
      </div>
    </NavLink>
  );
}