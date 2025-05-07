import "./Product.css";
import "./Product_adaptive.css";
import { useContext, useEffect, useState, useRef } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import Video from "../../Video/Video";
import { UserContext } from "../../../contexts/UserContext";
import { CartContext } from "../../../contexts/CartContext";
import api from "../../../utils/api"; // Добавлен импорт API
import AliceCarousel from "react-alice-carousel";

export default function Product(props) {
  //#region State и переменные
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const videoCarousel = useRef();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageNum, setCurrentImageNum] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(true);

  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [compositionOpen, setCompositionOpen] = useState(false);
  const [applianceOpen, setApplianceOpen] = useState(false);

  const { cart, cartAmounts } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [isLiked, setIsLiked] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [videos, setVideos] = useState([]);
  const [sameItems, setSameItems] = useState([]);
  const [colorHexes, setColorHexes] = useState([]);
  //#endregion
  const carouselSettings = {
    paddingLeft: 0,
    paddingRight: 0,
    mouseTracking: true, // Исправлено: разделены mouseTracking и responsive
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      900: { items: 3 },
      1200: { items: 5 }
    },
    disableButtonsControls: true
  };

  function slideNext(carousel, e) {
    // Stop event propagation to prevent video playback
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Check if carousel.current is not null
    if (!carousel.current) return;
    carousel.current.slideNext();
  }

  function slidePrev(carousel, e) {
    // Stop event propagation to prevent video playback
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!carousel.current) return;
    carousel.current.slidePrev();
  }
  //#region Методы
  // Загрузка данных о продукте напрямую через API
  const fetchProductData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const productData = await api.getProduct(id);
      if (productData) {
        setData(productData);

        // Проверяем наличие фотографий и устанавливаем первую как текущую
        if (productData.photos && productData.photos.length > 0) {
          setCurrentImage(productData.photos[0]);
          setAreButtonsDisabled(productData.photos.length < 2);
        } else {
          // Если фотографий нет, устанавливаем заглушку
          setCurrentImage("/images/placeholder.jpg");
          setAreButtonsDisabled(true);
        }

        // Проверяем, лайкнут ли товар пользователем
        if (userId && productData.likes) {
          setIsLiked(productData.likes.includes(userId));
        }

        // Проверяем доступность товара
        setDisabled(productData.stock === 0);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных о продукте:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка связанных видео
  const fetchRelatedVideos = async () => {
    if (!id) return;

    try {
      const videosData = await api.getVideos();
      if (videosData) {
        const filteredVideos = videosData.filter(vid => vid.product === id);
        setVideos(filteredVideos);
      }
    } catch (error) {
      console.error("Ошибка при загрузке видео:", error);
    }
  };

  // Загрузка товаров того же типа
  const fetchSameTypeItems = async () => {
    if (!data.type) return;

    try {
      const productsData = await api.getProducts();
      if (productsData && productsData.data) {
        const filtered = productsData.data.filter(item => item.type === data.type);
        setSameItems(filtered);
        setColorHexes(filtered.map(item => item.colorImage));
      }
    } catch (error) {
      console.error("Ошибка при загрузке товаров того же типа:", error);
    }
  };

  // Обновление данных из пропсов (если доступны)
  const updateDataFromProps = () => {
    if (!props.items || !id) return;

    const newData = props.items.find(item => item._id === id);
    if (newData) {
      setData(newData);

      if (newData.photos && newData.photos.length > 0) {
        setCurrentImage(newData.photos[currentImageNum] || newData.photos[0]);
        setAreButtonsDisabled(newData.photos.length < 2);
      }

      if (userId && newData.likes) {
        setIsLiked(newData.likes.includes(userId));
      }
    }
  };

  function nextImage() {
    if (!data.photos || data.photos.length < 2) return;

    const newNum = (currentImageNum + 1) % data.photos.length;
    setCurrentImageNum(newNum);
    setCurrentImage(data.photos[newNum]);
  }

  function prevImage() {
    if (!data.photos || data.photos.length < 2) return;

    const newNum = currentImageNum > 0 ? currentImageNum - 1 : data.photos.length - 1;
    setCurrentImageNum(newNum);
    setCurrentImage(data.photos[newNum]);
  }

  function selectImage(i) {
    if (!data.photos || !data.photos[i]) return;

    setCurrentImageNum(i);
    setCurrentImage(data.photos[i]);
  }

  function toggleLike(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!props.isLoggedIn) {
      props.openLoginModal();
      return;
    }

    props.likeItem(e, id);
    setIsLiked(!isLiked);
  }
  //#endregion

  //#region Эффекты
  // Загрузка данных при изменении ID
  useEffect(() => {
    if (id) {
      fetchProductData();
      fetchRelatedVideos();
    }
  }, [id]);

  // Загрузка товаров того же типа при изменении типа товара
  useEffect(() => {
    if (data.type) {
      fetchSameTypeItems();
    }
  }, [data.type]);

  // Обновление данных из пропсов при их изменении
  useEffect(() => {
    if (props.items && props.items.length > 0) {
      updateDataFromProps();
    }
  }, [props.items, id]);

  // Обновление видео при изменении пропсов
  useEffect(() => {
    if (props.videos && props.videos.length > 0 && id) {
      const filteredVideos = props.videos.filter(vid => vid.product === id);
      setVideos(filteredVideos);
    }
  }, [props.videos, id]);

  // Проверка доступности товара
  useEffect(() => {
    if (!data._id) return;

    // Проверяем наличие на складе
    if (data.stock === 0) {
      setDisabled(true);
      return;
    }

    // Проверяем, не превышено ли количество в корзине
    const index = cart.findIndex(cartItem => cartItem._id === data._id);
    if (index !== -1 && cartAmounts[index] >= data.stock) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [cart, cartAmounts, data]);
  //#endregion

  // Преобразуем видео-объекты в React-компоненты для карусели
  const videoItems = videos.map((video, i) => (
    <Video
      data={video}
      key={`video-${i}`}
    />
  ));

  //#region Рендеринг
  if (isLoading) {
    return <div className="product__loading">Загрузка...</div>;
  }

  // Проверка наличия данных
  if (!data || Object.keys(data).length === 0) {
    return <div className="product__error">Товар не найден</div>;
  }

  // Безопасная проверка наличия фотографий
  const hasPhotos = data.photos && Array.isArray(data.photos) && data.photos.length > 0;

  return (
    <main className="product">
      <div className="product__page">
        <div className="product__photos">
          <div className="product__gallery">
            {hasPhotos && data.photos.map((img, i) => (
              <img
                className="product__image"
                key={`image-${i}`}
                src={img}
                alt={`${data.name} - изображение ${i + 1}`}
                onClick={() => selectImage(i)}
              />
            ))}
          </div>
          <div className="product__current-image">
            <img
              className="product__main-image"
              src={currentImage || "/images/placeholder.jpg"}
              alt={data.name || "Изображение товара"}
            />
            {hasPhotos && data.photos.length > 1 && (
              <>
                <button
                  className="product__image-button product__image-button_left"
                  onClick={prevImage}
                  disabled={areButtonsDisabled}
                  aria-label="Предыдущее изображение"
                />
                <button
                  className="product__image-button product__image-button_right"
                  onClick={nextImage}
                  disabled={areButtonsDisabled}
                  aria-label="Следующее изображение"
                />
              </>
            )}
          </div>
        </div>
        <div className="product__info">
          <div className="product__main">
            <div className="product__title">
              <h2 className="product__name">{data.name || "Название товара"}</h2>
              <h3 className="product__price">
                {data.discount ? (
                  <div className="product__prices">
                    <span className="product__old-price">
                      {data.price}₽
                    </span>
                    {data.price - data.discount}₽
                  </div>
                ) : (
                  `${data.price || 0}₽`
                )}
              </h3>
            </div>
            <div className="product__properties">
              <p className="product__text">
                <span className="product__quality">Бренд: </span>
                {data.brand || "Не указан"}
              </p>
              <p className="product__text">
                <span className="product__quality">Страна производства: </span>
                {data.country || "Не указана"}
              </p>
              <p className="product__text">
                <span className="product__quality">Вес / объём: </span>
                {data.size || "Не указан"}
              </p>
              <p className="product__text">
                <span className="product__quality">Артикул: </span>
                {data.article || "Не указан"}
              </p>
              <p className="product__text">
                <span className="product__quality">Штрихкод: </span>
                {data.barcode || "Не указан"}
              </p>
              <p className="product__text">
                <span className="product__quality">Кол-во на складе: </span>
                {data.stock || 0}
              </p>
            </div>
            {sameItems.length > 0 && (
              <div className="product__color-choice">
                <p className="product__text">
                  <span className="product__quality">Цвет: </span>
                  {data.color || "Не указан"}
                </p>
                {/* <div className="product__colors">
                  {sameItems.map((item, i) => (
                    <NavLink
                      to={`/item?id=${item._id}`}
                      key={`color-${i}`}
                    >
                      <div
                        className="product__color-image"
                        style={{ backgroundColor: colorHexes[i] || "#ccc" }}
                      />
                    </NavLink>
                  ))}
                </div> */}
              </div>
            )}
          </div>
          <div className="product__all-details">
            <div className="product__details">
              <div className="product__details-header">
                О товаре
                <button
                  className={`product__more-button product__more-button_${descriptionOpen ? "minus" : "plus"}`}
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                  aria-label={descriptionOpen ? "Свернуть описание" : "Развернуть описание"}
                />
              </div>
              <p className={`product__details-text ${descriptionOpen ? "product__details-text_visible" : ""}`}>
                {data.description || "Описание отсутствует"}
              </p>
            </div>
            <div className="product__details">
              <div className="product__details-header">
                Состав
                <button
                  className={`product__more-button product__more-button_${compositionOpen ? "minus" : "plus"}`}
                  onClick={() => setCompositionOpen(!compositionOpen)}
                  aria-label={compositionOpen ? "Свернуть состав" : "Развернуть состав"}
                />
              </div>
              <p className={`product__details-text ${compositionOpen ? "product__details-text_visible" : ""}`}>
                {data.composition || "Состав не указан"}
              </p>
            </div>
            <div className="product__details">
              <div className="product__details-header">
                Способ применения
                <button
                  className={`product__more-button product__more-button_${applianceOpen ? "minus" : "plus"}`}
                  onClick={() => setApplianceOpen(!applianceOpen)}
                  aria-label={applianceOpen ? "Свернуть способ применения" : "Развернуть способ применения"}
                />
              </div>
              <p className={`product__details-text ${applianceOpen ? "product__details-text_visible" : ""}`}>
                {data.appliance || "Способ применения не указан"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="product__reviews">
        <h3 className="product__subtitle">Обзоры этого товара</h3>
        <div className="product__videos">
          {videos.length > 0 ? (
            <>
              <AliceCarousel
                items={videoItems} 
                {...carouselSettings}
                ref={videoCarousel}
              />

            </>
          ) : (
            <p className="product__no-videos">Обзоров пока нет</p>
          )}
        </div>

        <button
          className="profile__review-button"
          onClick={props.openVideoModal}
        >
          Новый обзор
        </button>
      </div>
    </main>
  );
  //#endregion
}
