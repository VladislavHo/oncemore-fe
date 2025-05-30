import React from "react";
import { NavLink } from "react-router-dom";
import "./Main.css";
// import video from "../../../temp/OnceMore.mp4";
import videoSrc from "./OnceMore.mp4";
export default function Main({ categories }) {
  const category = categories[0];


  console.log(videoSrc);
  return (
    <div className="main">
      {/* <div className="main" style={{background: 'rgba(255, 0, 0, 0.303)', display: 'flex', justifyContent: 'cnter', alignItems: 'center'}}> */}
      <div className="main--video">
        <div className="video--container">
      <video
        src={videoSrc}
        width="263"
          height={Math.round((263 * 1920) / 1080)} 
         loop
        muted     // Помогает с autoplay
        frameBorder="0"  // camelCase
        allowFullScreen  // camelCase
        autoPlay
        style={{ borderRadius: '15px'}}  // Видно область плеера
      >
        Ваш браузер не поддерживает HTML5 видео.
      </video>
          {/* <iframe
            src="https://vk.com/video_ext.php?oid=-227359578&id=456239019&hd=2&autoplay=1"
            width="265"
            height="540"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameborder="0"
            allowfullscreen
          ></iframe> */}
        </div>
      </div>
      <div className="main--info">
        <h3>
          Добро пожаловать в наше сообщество, посвященное шоппингу и обмену
          мнениями о косметике!
        </h3>
        <p>
          Здесь вы сможете значительно упростить процесс выбора и покупки
          товаров, сэкономив свое время и деньги.
        </p>
        <p>
          Шоппинг - это не просто процесс приобретения, это живое общение, где
          каждое новое приобретение становится частью вашей истории.
        </p>
        <p>
          Делитесь своими покупками, создавайте увлекательные сюжеты и получайте
          советы от реальных людей, а не просто рекламные описания.
        </p>
        <p>
          Мы предлагаем только достоверную информацию: честные видеоотзывы
          помогут вам избежать ненужных покупок и сделать правильный выбор.
        </p>
        <p>
          Присоединяйтесь к нам и получайте лайки за ваши видеоотзывы о товарах!
          Чем более искренними и реальными будут ваши отзывы, тем больше доверия
          они вызовут у других.
        </p>
        <h3>Вот как можно участвовать:</h3>
        <ol>
          <li>Создавайте видеоотзывы о плюсах и минусах товаров.</li>
          <li>Оценивайте видеоотзывы других пользователей.</li>
          <li>Приглашайте своих друзей в наше сообщество.</li>
          <li>
            Получайте вознаграждения за то, что делитесь своими видеотзывами.
          </li>
        </ol>
        <p>
          Давайте вместе сделаем шоппинг более увлекательным и информированным!
        </p>

        <div className="main-link--container">
          {/* <a href="/items?filter=Новинки"><span>К выбору</span></a> */}
          {category && category.link ? (
            <NavLink to={category.link || "#"}>
              <span>К выбору</span>
            </NavLink>
          ) : (
            <span className="disabled-link">К выбору</span>
          )}
        </div>
      </div>

      {/* <h1 style={{fontSize: "40px", textTransform: 'uppercase', color: 'white'}}>ведутся технические работы</h1> */}
    </div>
  );
}
