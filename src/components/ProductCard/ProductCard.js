import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { CartContext } from "../../contexts/CartContext";

export default function ProductCard(props) {
  function toggleLike(e) {
    e.stopPropagation()

    if (!props.isLoggedIn) {
      props.openLoginModal();
      return;
    }

    props.likeItem(e, _id);
    setIsLiked(!isLiked);
  }


  function onHover(e) {
    console.log(e.currentTarget)
  }

  function navigateTo(e, url) {
    console.log(e.currentTarget);
    console.log(e.target);

    navigate(url);
  }


  const { photos, name, price, _id, likes, stock, discount } = props.data;
  const userId = useContext(UserContext).user._id;
  const [isLiked, setIsLiked] = useState(likes.includes(userId));
  const navigate = useNavigate();

  const [isDisabled, setDisabled] = useState(stock != 0);

  const cart = useContext(CartContext).cart;
  const cartAmounts = useContext(CartContext).cartAmounts;

  useEffect(() => {
    const index = cart.findIndex((cartItem) => cartItem._id == _id)
    if (index != -1) {
      if (cartAmounts[index] >= stock)
        setDisabled(true);
    }
  }, [cartAmounts]);
  

  useEffect(() => {
    if (!userId) return;

    setIsLiked(likes.includes(userId));
  }, [props.data.likes, userId]);

  return (
    <div className={`item ${props.isSmall ? "item_small" : ""}`}
    onClick={(e) => navigateTo(e, `/item?id=${_id}`)}
    >
      <div className="item__image-container"
        onClick={(e) => navigateTo(e, `/item?id=${_id}`)}
      >
        <img className="item__image"
          src={photos[0]}
          alt={name}
          crossOrigin=""
        />
      </div>
      <div className="item__info">
        <h3 className="item__name">{name}</h3>
        <h4 className="item__price">
          {
            discount ? 
            <div className="item__prices">
              <span className="item__old-price">{price}₽</span>
              {price - discount}₽
            </div> :
            `${price}₽`
          }
        </h4>
      </div>
      {
        isDisabled ? "" :
        <button className="item__cart-button"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            props.addItem(_id)
          }}
        />
      }
      <button className={`item__like-button 
          ${isLiked ? "item__like-button_active" : ""}`}
        onClick={(e) => toggleLike(e)}
      />
    </div>
  );
}