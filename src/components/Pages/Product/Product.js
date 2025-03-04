import "./Product.css";
import "./Product_adaptive.css";
import { useContext, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import Video from "../../Video/Video";
import { UserContext } from "../../../contexts/UserContext";
import { CartContext } from "../../../contexts/CartContext";

export default function Product(props) {
  //#region Methods
  const searchParams = useSearchParams();
  const id = searchParams[0].get("id");

  const [data, setData] = useState({});

  const [currentImageNum, setCurrentImageNum] = useState(0);
  const [currentImage, setCurrentImage] = useState({});

  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [compositionOpen, setCompositionOpen] = useState(false);
  const [applianceOpen, setApplianceOpen] = useState(false);

  let areButtonsDisabled = true;

  const cart = useContext(CartContext).cart;
  const cartAmounts = useContext(CartContext).cartAmounts;
  const [isDisabled, setDisabled] = useState();
  console.log(props, 'ITEMS PROPS!!!')
  function nextImage() {
    const newNum = (currentImageNum + 1) % data.photos.length;
    setCurrentImageNum(newNum);
    setCurrentImage(data.photos[newNum]);
  }

  function prevImage() {
    const newNum = currentImageNum > 0 ?
      currentImageNum - 1 :
      data.photos.length - 1;
    setCurrentImageNum(newNum);
    setCurrentImage(data.photos[newNum]);
  }

  function selectImage(i) {
    setCurrentImageNum(i);
    setCurrentImage(data.photos[i]);
  }

  function toggleLike(e) {
    if (!props.isLoggedIn) {
      props.openLoginModal();
      return;
    }

    props.likeItem(e, id);
    setIsLiked(!isLiked);
  }

  function updateData() {
    const newData = props.items
      .find((item) => item._id == id)
    setData(newData);

    setCurrentImage(newData.photos[currentImageNum]);
    areButtonsDisabled = newData.photos.length < 2;
    setIsLiked(newData.likes.includes(userId));
  }

  //#endregion

  //#region Variables



  useEffect(() => {
    if (!data._id) return;
    if (data.stock == 0)
      setDisabled(true);

    const index = cart.findIndex((cartItem) => cartItem._id == data._id)
    if (index != -1) {
      if (cartAmounts[index] >= data.stock)
        setDisabled(true);
    }
  }, [cartAmounts, data]);


  useEffect(() => {
    updateData();
  }, [props.items, searchParams])


  const videos = props.videos.filter((vid) => vid.productId == id);
  const sameItems = props.items.filter((item) => item.type == data.type);
  const colorHexes = sameItems.map((item) => item.colorImage);

  const userId = useContext(UserContext).user.id;
  const [isLiked, setIsLiked] = useState(false);

  //#endregion

  //#region Rendering
  console.log(data, 'DATA PRODUCT');

  if (!data.photos) return;

  return (
    <main className="product">
      <div className="product__page">
        <div className="product__photos">
          <div className="product__gallery">
            {
              data.photos.length !== 0 && data.photos.map((img, i) => (
                <img className="product__image"
                  key={`image-${i}`}
                  src={`${img}`}
                  onClick={() => selectImage(i)}
                />)
              )
            }
          </div>
          <div className="product__current-image">
            <img className="product__main-image"
              src={currentImage}
              alt={data.name}
            />
            <button className=
              "product__image-button product__image-button_left"
              onClick={prevImage}
              disabled={areButtonsDisabled}
            />
            <button className=
              "product__image-button product__image-button_right"
              onClick={nextImage}
              disabled={areButtonsDisabled}
            />
          </div>
        </div>
        <div className="product__info">
          <div className="product__main">
            <div className="product__title">
              <h2 className="product__name">{data.name}</h2>
              <h3 className="product__price">
                {
                  data.discount ?
                    <div className="product__prices">
                      <span className="product__old-price">
                        {data.price}₽
                      </span>
                      {data.price - data.discount}₽
                    </div> :
                    `${data.price}₽`

                }
              </h3>
            </div>
            <div className="product__properties">
              <p className="product__text">
                <span className="product__quality">Бренд: </span>
                {data.brand}
              </p>
              <p className="product__text">
                <span className="product__quality">Страна производства: </span>
                {data.country}
              </p>
              <p className="product__text">
                <span className="product__quality">Вес / объём: </span>
                {data.size}
              </p>
              <p className="product__text">
                <span className="product__quality">Артикул: </span>
                {data.article}
              </p>
              <p className="product__text">
                <span className="product__quality">Штрихкод: </span>
                {data.barcode}
              </p>
              <p className="product__text">
                <span className="product__quality">Кол-во на складе: </span>
                {data.stock}
              </p>
            </div>
            <div className="product__color-choice">
              <p className="product__text">
                <span className="product__quality">Цвет: </span>
                {data.color}
              </p>
              <div className="product__colors">
                {
                  sameItems.map((item, i) =>
                    <NavLink to={`/item?id=${item._id}`}
                      key={`color-${i}`}
                    >
                      <div className="product__color-image"
                        style={{ backgroundColor: colorHexes[i] }}
                      />
                    </NavLink>
                  )
                }
              </div>
            </div>
            <div className="product__buttons">
              <button className="product__cart-button"
                type="button"
                // disabled={isDisabled}
                onClick={() => props.addItem(id)}
              >
                Добавить в корзину
              </button>
              <button className={`product__like-button 
                ${isLiked ? "product__like-button_active" : ""}`}
                onClick={toggleLike}
              />
            </div>
          </div>
          <div className="product__all-details">
            <div className="product__details">
              <div className="product__details-header">
                О товаре
                <button className={`product__more-button 
                  product__more-button_${descriptionOpen ? "minus" : "plus"}`}
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                />
              </div>
              <p className={`product__details-text
                  ${descriptionOpen ? "product__details-text_visible" : ""}`}
              >
                {data.description}
              </p>
            </div>
            <div className="product__details">
              <div className="product__details-header">
                Состав
                <button className={`product__more-button 
                  product__more-button_${compositionOpen ? "minus" : "plus"}`}
                  onClick={() => setCompositionOpen(!compositionOpen)}
                />
              </div>
              <p className={`product__details-text
                  ${compositionOpen ? "product__details-text_visible" : ""}`}
              >
                {data.composition}
              </p>
            </div>
            <div className="product__details">
              <div className="product__details-header">
                Способ применения
                <button className={`product__more-button 
                  product__more-button_${applianceOpen ? "minus" : "plus"}`}
                  onClick={() => setApplianceOpen(!applianceOpen)}
                />
              </div>
              <p className={`product__details-text
                  ${applianceOpen ? "product__details-text_visible" : ""}`}
              >
                {data.appliance}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="product__reviews">
        <h3 className="product__subtitle">Обзоры этого товара</h3>
        <div className="product__videos">
          {
            videos.map((video, i) =>
              <Video
                data={video}
                key={`video-${i}`}
                getProduct={video.getProduct}
              />
            )
          }
        </div>

        {/* {
          props.isLoggedIn ?
            <button className="profile__review-button"
              onClick={props.openVideoModal}
            >
              Новый обзор
            </button>
            : ""
        } */}
      </div>
    </main>
  );

  //#endregion
}