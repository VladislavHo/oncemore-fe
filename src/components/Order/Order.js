import { useEffect, useState } from "react";
import "./Order.css";

export default function Order(props) {
  function submit(e) {
    e.preventDefault();
    
    props.updateOrderStatus(_id, newStatus)
      .then(() => setStatus(newStatus));
  }

  const {data, isAdmin} = props;
  const {
    _id, date, items, quantity, name, address, phone, email
  } = data;
  const [status, setStatus] = useState(data.status);
  const [newStatus, setNewStatus] = useState(data.status);


  const itemsParse = JSON.parse(items)

  return (
    <div className="order">
      <h3 className="order__title">
        Заказ {_id}
      </h3>
      <p className="order__text">
        <span className="order__accent">Дата: </span>
        {date.split("T")[0]}
      </p>
      <p className="order__text">
        <span className="order__accent">Статус: </span>
        {status}
      </p>
      {
        isAdmin ? 
        <div className="order__user">
          <p className="order__text">
            <span className="order__accent">ФИО: </span>
            {name}
          </p>
          <p className="order__text">
            <span className="order__accent">Адрес: </span>
            {address}
          </p>
          <p className="order__text">
            <span className="order__accent">Email: </span>
            {email}
          </p>
          <p className="order__text">
            <span className="order__accent">Телефон: </span>
            {phone}
          </p>
        </div>
        : ""
      }
      <div className="order__items">
      {
        itemsParse.map((item, i) => (
          <div className="order__item" key={`item-${i}`}>
            <img className="order__image"
              src={item.photos ? item.photos[0]: ""}
            />
            <div className="order__item-info">
              <p className="order__text">
                <span className="order__accent">{item.name}</span>
              </p>
              <p className="order__text">
                <span className="order__accent">Цвет: </span>
                {item.color}
              </p>
              <p className="order__text">
                <span className="order__accent">Количество: </span>
                {quantity[i]}
              </p>
            </div>
            <p className="order__item-price">{item.price}₽</p>
          </div>
        ))
      }
      </div>
      {
        isAdmin ?
        <form className="order__admin"
        onSubmit={(e) => submit(e)}
        >
          <select className="order__select"
            id="order-status"
            onChange={(e) => setNewStatus(e.target.value)}
            value={newStatus}
          >
            <option value="В обработке">В обработке</option>
            <option value="Собирается">Собирается</option>
            <option value="Выслан">Выслан</option>
            <option value="Доставлен">Доставлен</option>
            <option value="Отклонён">Отклонён</option>
          </select>
          <button type="submit" className="order__button">
            Обновить статус
          </button>
        </form>
        : ""
      }
    </div>
  );
}