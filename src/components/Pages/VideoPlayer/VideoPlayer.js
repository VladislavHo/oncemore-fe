import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import UserAvatar from "../../UserAvatar/UserAvatar";
import Video from "../../Video/Video";
import ProductCard from "../../ProductCard/ProductCard";
import Review from "../../Review/Review";
import Comments from "../../Comments/Comments";
import { UserContext } from "../../../contexts/UserContext";
import { parseViews } from "../../../utils/parsers";
import playIcon from "../../../images/play.svg";
import "./VideoPlayer.css";
import "./VideoPlayer_adaptive.css";

/**
 * Компонент для просмотра видео и связанной информации
 */
export default function VideoPlayer(props) {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  // Состояния
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedViews, setParsedViews] = useState("");
  const [videos, setVideos] = useState([]);
  const [profile, setProfile] = useState([]);
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Получаем данные о пользователе из контекста
  const { user } = useContext(UserContext);
  const isAdmin = user?.privilege >= 1;

  /**
   * Отправка комментария
   */
  const sendComment = useCallback(async (commentText) => {
    if (!data || !data._id) return;

    try {
      await props.sendComment(commentText, data._id);
      const commentData = await props.getComments(data._id);
      setComments(commentData.data || []);
    } catch (error) {
      console.error("Ошибка при отправке комментария:", error);
    }
  }, [data, props]);

  /**
   * Переключение видимости комментариев
   */
  const toggleComments = useCallback(() => {
    setCommentsOpen(prev => !prev);
  }, []);

  /**
   * Удаление видео (для администраторов)
   */
  const handleDeleteVideo = useCallback(async () => {
    if (!data) return;

    try {
      await props.deleteReview(data);
      navigate(-1);
    } catch (error) {
      console.error("Ошибка при удалении видео:", error);
    }
  }, [data, props, navigate]);

  /**
   * Блокировка пользователя (для администраторов)
   */
  const handleBlockUser = useCallback(async () => {
    if (!userData) return;

    try {
      await props.blockUser(userData);
      alert(`Пользователь ${userData.name} заблокирован`);
    } catch (error) {
      console.error("Ошибка при блокировке пользователя:", error);
    }
  }, [userData, props]);

  /**
   * Загрузка данных о видео
   */
  useEffect(() => {
    if (!id) {
      setError("Идентификатор видео не указан");
      setIsLoading(false);
      return;
    }

    if (!props.videos || props.videos.length === 0) {
      return; // Ждем загрузки видео
    }

    const videoData = props.videos.find(video => video._id === id);
    if (videoData) {
      setData(videoData);
    } else {
      setError("Видео не найдено");
    }

    setIsLoading(false);
  }, [id, props.videos]);

  /**
   * Загрузка связанных данных после получения информации о видео
   */
  useEffect(() => {
    if (!data || !data.product) return;

    const loadRelatedData = async () => {
      try {
        // Загружаем данные о продукте
        const product = props.getProduct(data.product);
        if (product) {
          setProductData(product);

          // Загружаем похожие продукты, если есть информация о продукте
          if (props.items && props.items.length > 0) {
            setSimilarProducts(
              props.items
                .filter(item => item.category === product.category && item._id !== product._id)
                .slice(0, 4)
            );
          }
        }

        // Фильтруем видео по продукту независимо от наличия пользователя
        if (props.videos && props.videos.length > 0) {
          setVideos(props.videos.filter(vid => vid.product === data.product && vid._id !== id));
        }

        // Загружаем данные о пользователе, если есть автор
        if (data.author) {
          try {
            const userResponse = await props.getUser(data.author);
            if (userResponse && userResponse.data) {
              setUserData(userResponse.data);

              // Фильтруем видео по автору только если получили данные о пользователе
              if (props.videos && props.videos.length > 0) {
                setProfile(props.videos.filter(vid => vid.author === data.author && vid._id !== id));
              }
            }
          } catch (userError) {
            console.warn("Не удалось загрузить данные о пользователе:", userError);
            // Продолжаем работу даже без данных о пользователе
          }
        } else {
          // Если нет автора, устанавливаем базовые данные о пользователе
          setUserData({
            name: "Аноним",
            handle: "unknown",
            avatar: "/images/default-avatar.png" // Путь к изображению по умолчанию
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке связанных данных:", error);
        setError("Ошибка при загрузке некоторых данных, но видео доступно");
      }
    };

    loadRelatedData();
  }, [data, id, props]);

  /**
   * Обновление счетчика просмотров и загрузка комментариев
   */
  useEffect(() => {
    if (!data || !data._id) return;

    const updateViewsAndComments = async () => {
      try {
        // Обновляем счетчик просмотров
        setParsedViews(parseViews(data.views + 1));
        await props.addView(data._id, data.views, data.author);

        // Загружаем комментарии
        const commentData = await props.getComments(data._id);
        setComments(commentData.data || []);
      } catch (error) {
        console.error("Ошибка при обновлении просмотров или загрузке комментариев:", error);
      }
    };

    updateViewsAndComments();
  }, [data, props]);

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <div className="player__loading">
        <p>Загрузка видео...</p>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="player__error">
        <p>{error}</p>
        <button
          className="player__back-button"
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  // Проверка наличия необходимых данных
  if (!data || !userData || !productData) {
    return (
      <div className="player__error">
        <p>Не удалось загрузить данные</p>
        <button
          className="player__back-button"
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <main className="player">
      <div className="player__main">
        <div className="player__main-container">
          {data.video && data.video.oid && data.video.id ? (
            <iframe
              src={`https://vk.com/video_ext.php?oid=-${data.video.oid}&id=${data.video.id}&hd=2&autoplay=0`}
              width="363"
              height="714"
              allow="fullscreen;"
              frameBorder="0"
              allowFullScreen
              title={`Видео ${productData.name}`}
            />
          ) : (
            <div className="player__video-error">
              Видео недоступно
            </div>
          )}
        </div>

        {/* <div className="player__video-info">
          <div className="player__user">
            {userData && (
              <>
                <UserAvatar userData={userData} />
                <div className="player__author">
                  {userData.handle || userData.name}
                </div>
              </>
            )}
          </div>

          <div className="player__views">
            <img
              className="player__views-icon"
              src={playIcon}
              alt="Просмотры"
            />
            {parsedViews || 0}
          </div>

          <div className="player__controls">
            <button
              className="player__video-button player__video-button_comment"
              onClick={toggleComments}
              aria-label={commentsOpen ? "Скрыть комментарии" : "Показать комментарии"}
            />

            <button
              className="player__video-button player__video-button_share"
              onClick={props.openShareModal}
              aria-label="Поделиться"
            />
          </div>
        </div> */}

        {/* <button
          className="player__video-button player__video-button_close"
          onClick={() => navigate(-1)}
          aria-label="Закрыть"
        /> */}

        {commentsOpen && (
          <Comments
            comments={comments}
            getUser={props.getUser}
            setCommentsOpen={setCommentsOpen}
            deleteComment={props.deleteComment}
            sendComment={sendComment}
            likeComment={props.likeComment}
          />
        )}
      </div>

      <div className="player__products">
        {isAdmin && (
          <div className="player__admin">
            <button
              className="player__admin-button"
              onClick={handleDeleteVideo}
            >
              Удалить видео
            </button>
            <button
              className="player__admin-button"
              onClick={handleBlockUser}
            >
              Заблокировать пользователя
            </button>
          </div>
        )}

        <h2 className="player__review-title">
          Обзор продукта {productData.name} от пользователя {userData.name}
        </h2>

        <div className="player__product">
          <div className="player__image-container">
            {productData.photos && productData.photos.length > 0 ? (
              <img
                className="player__product-image"
                src={productData.photos[0]}
                alt={productData.name}
              />
            ) : (
              <div className="player__product-no-image">
                Нет изображения
              </div>
            )}
          </div>

          <div className="player__product-info">
            <h3 className="player__title">{productData.name}</h3>
            <h4 className="player__price">
              {productData.price}₽
              {productData.discount > 0 && (
                <span className="player__discount">
                  -{productData.discount}₽
                </span>
              )}
            </h4>
            <p>{productData.description}</p>
          </div>

          {/* <button
            className="player__cart-button"
            type="button"
            onClick={() => props.addItem && props.addItem(productData._id)}
            aria-label="Добавить в корзину"
          /> */}
        </div>

        {videos.length > 0 && (
          <div className="player__category">
            <div className="player__category-header">
              <h3 className="player__subtitle">
                Другие обзоры
              </h3>
              <NavLink
                className="catalogue__more"
                to={`/items/gallery?filtering=item&filter=${data.product}&type=videos`}
              >
                Посмотреть всё
              </NavLink>
            </div>

            <div className="player__gallery">
              {videos.map((video, i) => (
                <Video
                  isSmall={true}
                  data={video}
                  key={`video-${i}`}
                  getProduct={props.getProduct}
                />
              ))}
            </div>
          </div>
        )}



        {data.text && (
          <div className="player__review">
            <h3 className="player__subtitle">
              Что {userData.name} говорит о {productData.name}
            </h3>
            <Review
              author={userData}
              videoData={data}
            />
          </div>
        )}

        {profile.length > 0 && (
          <div className="player__category">
            <div className="player__category-header">
              <h3 className="player__subtitle">
                Обзоры пользователя {userData.name}
              </h3>
              <NavLink
                className="catalogue__more"
                to={`/items/gallery?filtering=user&filter=${data.author}&type=videos`}
              >
                Посмотреть всё
              </NavLink>
            </div>

            <div className="player__gallery">
              {profile.map((video, i) => (
                <Video
                  isSmall={true}
                  data={video}
                  key={`profile-video-${i}`}
                  getProduct={props.getProduct}
                />
              ))}
            </div>
          </div>
        )}
        {similarProducts.length > 0 && (
          <div className="player__category">
            <div className="player__category-header">
              <h3 className="player__subtitle">
                Похожие товары
              </h3>
              <NavLink
                className="catalogue__more"
                to={`/items/gallery?filtering=category&filter=${productData.category}&type=items`}
              >
                Посмотреть всё
              </NavLink>
            </div>

            <div className="player__gallery">
              {similarProducts.map((product, i) => (
                <ProductCard
                  isSmall={true}
                  data={product}
                  key={`product-${i}`}
                  addItem={props.addItem}
                  likeItem={props.likeItem}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}