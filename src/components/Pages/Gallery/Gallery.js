import { NavLink, useSearchParams } from "react-router-dom";
import "./Gallery.css";
import ProductCard from "../../ProductCard/ProductCard";
import Video from "../../Video/Video";
import { useEffect } from "react";

export default function Gallery(props) {
  function getFilter()
  {
    if (filtering == "category")
      return (item) => item.category == filter || filter == "Новинки";
    if (filtering == "item")
      return (video) => video.product == filter;
    if (filtering == "user")
      return (video) => video.author == filter;
    if (filtering == "search") {
      const newFilter = filter.toLowerCase();
      return (item) => item.name.toLowerCase().includes(newFilter);
    }
    return () => true;
  }

  const searchParams = useSearchParams();
  const filter = searchParams[0].get("filter");
  const type = searchParams[0].get("type");
  const filtering = searchParams[0].get("filtering");
  let items = props.items;
  let videos = props.videos;
  
  if (type == "items")
    items = props.items.filter(getFilter())
  else
    videos = props.videos.filter(getFilter());


  return (
    <main className="gallery">
      <div className="gallery__header">
        <NavLink className="gallery__link" 
          to={`/items?filter=foryou`}
        >
          Главная
        </NavLink>
        /

        {
          filtering == "category" ?
        <NavLink className="gallery__link" 
          to={`/items?filter=${filter}`}
        >
          {filter}
        </NavLink> : ""
        }
        /
        <span className="gallery__current">
          {type == "items" ? "Все товары" : "Все обзоры"}
        </span>
      </div>
      <div className="gallery__items">
        {
          type == "items" ?
          items.map((data, i) => 
            <ProductCard
              data={data}
              key={`product-${i}`}
              addItem={props.addItem}
              likeItem={props.likeItem}
              openLoginModal={props.openLoginModal}
              isLoggedIn={props.isLoggedIn}
            />
          ) 
          :
          videos.map((video, i) => 
            <Video
              data={video}
              key={`video-${i}`}
              getProduct={props.getProduct}
            />
          )
        }
      </div>
    </main>
  );
}