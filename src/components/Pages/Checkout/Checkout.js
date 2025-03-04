import { useContext, useEffect, useReducer, useRef, useState } from "react";
import "./Checkout.css";
import { CartContext } from "../../../contexts/CartContext";
import { UserContext } from "../../../contexts/UserContext";
import { FormValidator } from "../../../utils/FormValidator";

export default function Checkout(props) {
  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const totalPrice = localStorage.getItem("totalPrice");
  const spentPoints = localStorage.getItem("spentPoints");
  const items = localStorage.getItem("cart");
  const quantity = localStorage.getItem("cartAmounts");
  const user = useContext(UserContext).user;
  const formRef = useRef();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+7");
  const [address, setAddress] = useState("");
  function enableValidation() {
    const formElement = formRef.current;
    const newValidator = new FormValidator(formElement, setButtonActivity);
    newValidator.enableValidation();
    setValidator(newValidator);
  }

  function toggleButtonState() {
    validator.toggleButtonState();
  }

  function submit(e) {
    e.preventDefault();

    props.spendPoints(spentPoints);
    localStorage.setItem("spentPoints", 0);

    props.onSubmit({ user: user._id, name, email, phone, address, items, quantity });
  }




  useEffect(() => {
    if (!user) return;

    setEmail(user.email);
    setPhone(user.phone);
  }, [user]);

  useEffect(() => {
    enableValidation();
  }, []);


  return (
    <main className="checkout">
      <form className="checkout__form"
        ref={formRef}
        onSubmit={(e) => submit(e)}
      >
        <label className="modal__label">
          <p className="modal__label-text checkout__label-text">ФИО</p>
          <input className="modal__input"
            type="text"
            placeholder="Ввведите ФИО..."
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              toggleButtonState();
            }}
          />
        </label>

        <label className="modal__label">
          <p className="modal__label-text checkout__label-text">Телефон</p>
          <input className="modal__input"
            type="tel"
            required
            value={phone}
            pattern="\+7[0-9]{10}"
            onChange={(e) => {
              setPhone(e.target.value);
              toggleButtonState();
            }}
          />
        </label>

        <label className="modal__label">
          <p className="modal__label-text checkout__label-text">E-mail</p>
          <input className="modal__input"
            type="email"
            placeholder="Ввведите e-mail..."
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              toggleButtonState();
            }}
          />
        </label>

        <label className="modal__label">
          <p className="modal__label-text checkout__label-text">Адрес</p>
          <input className="modal__input"
            type="text"
            placeholder="Ввведите адрес..."
            required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              toggleButtonState();
            }}
          />
        </label>

        <p className="checkout__total">
          Итого: {totalPrice}₽
        </p>

        <button className="checkout__button"
          type="submit"
          disabled={!isButtonActive}
        >
          Продолжить
        </button>
      </form>
    </main>
  );
}