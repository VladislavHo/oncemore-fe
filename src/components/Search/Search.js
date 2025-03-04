import "./Search.css";
import icon from "../../images/search.svg";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Search(props) {
  function onSubmit() {
    navigate(`items/gallery?filtering=search&filter=${query}&type=items`);
  }

  const [query, setQuery] =  useState("");
  const navigate = useNavigate();

  return (
    <div className="search">
      <form className="search__form" onSubmit={onSubmit}>
        <input className="search__input"
          type="text"
          placeholder="Введите запрос..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img className="search__icon"
          src={icon}
        />
        <button className="search__button" type="submit">
          Поиск
        </button>
      </form>
    </div>
  );
}