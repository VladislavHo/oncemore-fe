import React, { useRef } from 'react'


import { NavLink } from "react-router-dom";
import play from "../../images/play.svg";
import { parseViews } from "../../utils/parsers";
import { useEffect, useState } from "react";
import "./Video.css";

export default function Video(props) {
  const { video, views, product, _id } = props.data;
  const [isHovered, setIsHovered] = useState(false);
  const parsedViews = parseViews(views);
  const [productData, setProductData] = useState(props.getProduct(product));

  if (!productData) return;

  console.log(isHovered, "isHovered", video);


  return (
    <NavLink className={`video ${props.isSmall ? "video_small" : ""}`}
      to={`/review?id=${_id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="video__container"

      >
        <iframe
          key={`${video.oid}-${video.id}`}
          src={`https://vk.com/video_ext.php?oid=-${video.oid}&id=${video.id}&hd=2&autoplay=0`}
          width="265"
          height="540"
          style={{ border: 'none' }}
          allow="fullscreen"
          allowFullScreen
        />        {/* <div className="video__views">
          <img className="video__view-icon"
            src={play}
          />
          {parsedViews}
        </div> */}
        <button className="video__button" />
      </div>
      <div className="video__info">
        <h4 className="video__title">{productData.name}</h4>
        <h5 className="video__price">{productData.price}₽</h5>
      </div>
    </NavLink>
  );
}