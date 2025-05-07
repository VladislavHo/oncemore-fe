import "./Catalogue.css";
import ProductCard from "../../ProductCard/ProductCard";
import MultiSelect from "../../MultiSelect/MultiSelect";
import { getUniqueItems } from "../../../utils/uniqueItems";
import { useEffect, useRef, useState } from "react";
import Video from "../../Video/Video";
import AliceCarousel from "react-alice-carousel";
import { NavLink, useSearchParams } from "react-router-dom";

export default function Catalogue(props) {
  const colors = getUniqueItems(props.items.map((data) => data.color));
  const maxItemPrice = Math.max(...(props.items.map((data) => data.price)));

  const categoryItemsCarousel = useRef();
  const videoCarousel = useRef();
  const itemCarousel = useRef();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("filter") || "Все"; // Добавлено значение по умолчанию

  const [isNew, setIsNew] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [selectedColors, setColors] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(maxItemPrice);

  const videosProps = props.videos || []; // Добавлена проверка на null
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(()=>{
    setFilteredItems(props.items)
  }, [props.items])


  const items = filteredItems.map((data, i) =>
    <ProductCard
      data={data}
      key={`product-${i}`}
      addItem={props.addItem}
      likeItem={props.likeItem}
      openLoginModal={props.openLoginModal}
      isLoggedIn={props.isLoggedIn}
    />
  );

  const videos = videosProps.map((video, i) =>
    <Video
      data={video}
      key={`video-${i}`}
      getProduct={props.getProduct}
    />
  );

  //#region Methods

  function selectColors(changedColor) {
    if (selectedColors.includes(changedColor)) {
      setColors(selectedColors.filter((el) => el !== changedColor));
    } else {
      setColors([...selectedColors, changedColor]);
    }
  }

  function filterItems() {
    setFilteredItems(
      props.items.filter((item) => (
        (selectedColors.length === 0 || selectedColors.includes(item.color))
        && (item.price >= minPrice && item.price <= maxPrice)
        && (item.isNew || !isNew)
        && (item.discount > 0 || !discount)
        && (category === "Новинки" ? item.isNew : item.category === category)
      ))
    );
  }

  // Исправлена функция slideNext с проверкой на null
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

  //#endregion

  //#region  Variables

  useEffect(filterItems,
    [selectedColors, maxPrice, minPrice, isNew, discount, category]
  );

  //#endregion

  // Общие настройки для карусели
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

  return (
    <main className="catalogue">
      <h2 className="catalogue__title">{category}</h2>
      <section className="catalogue__products">
        <div className="catalogue__filters">
          <form className="catalogue__filter-form">
            <label className="catalogue__label">
              Новинки
              <input className="catalogue__checkbox"
                type="checkbox"
                id="filter-new"
                onChange={(e) => setIsNew(e.target.checked)}
              />
            </label>
            <label className="catalogue__label">
              Скидки
              <input className="catalogue__checkbox"
                type="checkbox"
                id="filter-discount"
                onChange={(e) => setDiscount(e.target.checked)}
              />
            </label>
            <MultiSelect
              options={colors}
              onSelect={selectColors}
              title="Цвет"
            />
            <label className="catalogue__label">
              Цена от
              <input className="catalogue__num-input"
                type="number"
                id="filter-min-price"
                min={0}
                onChange={(e) => setMinPrice(Number(e.target.value))} // Преобразование в число
                defaultValue={minPrice}
                placeholder="0"
              />
              до
              <input className="catalogue__num-input"
                type="number"
                id="filter-max-price"
                min={0}
                onChange={(e) => setMaxPrice(Number(e.target.value))} // Преобразование в число
                defaultValue={maxPrice}
                placeholder={maxItemPrice}
              />
            </label>
          </form>
        </div>
        <div className="catalogue__category">
          <h3 className="catalogue__subtitle">#лучшее</h3>
          <NavLink className="catalogue__more"
            to={`/items/gallery?filtering=category&filter=${category}&type=items`}
          >
            Посмотреть всё
          </NavLink>
        </div>
        
        <div className="catalogue__gallery catalogue__gallery_scroll">
          <AliceCarousel
            items={items}
            {...carouselSettings} // Используем общие настройки
            ref={categoryItemsCarousel}
          />
          <button
            className="catalogue__carousel-btn catalogue__carousel-btn_prev"
            type="button"
            onClick={(e) => slidePrev(categoryItemsCarousel, e)}
          />
          <button
            className="catalogue__carousel-btn catalogue__carousel-btn_next"
            type="button"
            onClick={(e) => slideNext(categoryItemsCarousel, e)}
          />
        </div>
        <div className="catalogue__category">
          <h3 className="catalogue__subtitle">{`#${category.toLowerCase()}`}</h3>
          <NavLink className="catalogue__more"
            to={`/items/gallery?filtering=category&filter=${category}&type=items`}
          >
            Посмотреть всё
          </NavLink>
        </div>
        <div className="catalogue__gallery catalogue__gallery_scroll">
          <AliceCarousel
            items={items}
            {...carouselSettings} // Используем общие настройки
            ref={itemCarousel}
          />
          <button
            className="catalogue__carousel-btn catalogue__carousel-btn_prev"
            type="button"
            onClick={(e) => slidePrev(itemCarousel, e)}
          />
          <button
            className="catalogue__carousel-btn catalogue__carousel-btn_next"
            type="button"
            onClick={(e) => slideNext(itemCarousel, e)}
          />
        </div>
      </section>

      {videos.length > 0 && ( // Улучшенное условное рендеринг
        <section className="catalogue__reviews">
          <div className="catalogue__category">
            <h3 className="catalogue__subtitle">#видео отзывы</h3>
            <NavLink className="catalogue__more"
              to={`/items/gallery?filtering=category&filter=${category}&type=videos`}
            >
              Посмотреть всё
            </NavLink>
          </div>
          <div className="catalogue__videos">
            <AliceCarousel
              items={videos}
              {...carouselSettings} // Используем общие настройки
              ref={videoCarousel}
            />
            {/* <button
              className="catalogue__carousel-btn catalogue__carousel-btn_prev"
              type="button"
              onClick={(e) => slidePrev(videoCarousel, e)}
            />
            <button
              className="catalogue__carousel-btn catalogue__carousel-btn_next"
              type="button"
              onClick={(e) => slideNext(videoCarousel, e)}
            /> */}
          </div>
        </section>
      )}
    </main>
  );
}