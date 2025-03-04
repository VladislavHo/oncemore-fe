import { useContext, useEffect, useState } from "react";
import "./Admin.css";
import { UserContext } from "../../../contexts/UserContext";
import Order from "../../Order/Order";

export default function Admin(props) {
  const user = useContext(UserContext).user;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user.privilege < 1) return;
    props.getOrders()
      .then((res) => setOrders(res));
  }, []);

  return (
    <main className="admin">
      {
        user.privilege < 2 ? "" :
        <div className="admin__buttons">
          <button className="admin__button"
            onClick={props.openProductModal}
          >
            Новый продукт
          </button>
          <button className="admin__button"
            onClick={props.openEditProductModal}
          >
            Редактировать продукт
          </button>
          <button className="admin__button"
            onClick={props.openProductPhotoModal}
          >
            Добавить фото продукта
          </button>
          <button className="admin__button"
            onClick={props.openProductStockModal}
          >
            Кол-во продукта на складе
          </button>
          <button className="admin__button"
            onClick={props.openDiscountModal}
          >
            Скидка на продукт
          </button>

          <button className="admin__button"
            onClick={props.openBannerModal}
          >

            Добавить баннер
          </button>
          <button className="admin__button"
            onClick={props.openDeleteBannerModal}
          >
            Удалить баннер
          </button>

          <button className="admin__button"
            onClick={props.openCategoryModal}
          >
            Добавить категорию
          </button>
          <button className="admin__button"
            onClick={props.openDeleteCategoryModal}
          >
            Удалить категорию
          </button>
        </div>
      }
      {
        user.privilege < 1 ? "" :
        <div className="admin__orders">
          <h2 className="admin__title">Заказы</h2>
          <div className="admin__order-cards">
            {
              orders.map((order, i) => (
                <Order
                  updateOrderStatus={props.updateOrderStatus}
                  data={order}
                  isAdmin={true}
                  getProduct={props.getProduct}
                  key={`order-${i}`}
                />
              ))
            }
          </div>
        </div>
      }
    </main>
  );
}