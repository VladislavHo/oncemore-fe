import React, { useState, useEffect } from "react";
import "./cookies.css";
import { Closes_SVG } from "../SVG/SVG";
import { useCookies } from "react-cookie";

export default function CookieComponent() {
  const [cookies, setCookie] = useCookies(["agreement"]);


  const saveUserDataToCookie = () => {
    setCookie("agreement", "true", { path: "/", maxAge: 365 * 24 * 60 * 60 }); 

  };




  if (cookies.agreement) {
    return null;
  }

  return (
    <div className="cookies">
      <button className="cookie--close" onClick={saveUserDataToCookie}>
        <Closes_SVG />
      </button>
      <div className="cookies--container">
        <p>
          МЫ ИСПОЛЬЗУЕМ СООКІЕ-ФАЙЛЫ ДЛЯ НАИЛУЧШЕГО ПРЕДСТАВЛЕНИЯ НАШЕГО САЙТА.
        </p>
        <p>
          ПРОДОЛЖАЯ ИСПОЛЬЗОВАТЬ ЭТОТ САЙТ, ВЫ СОГЛАШАЕТЕСЬ С ИСПОЛЬЗОВАНИЕМ
          СООКІЕ-ФАЙЛОВ
        </p>
      </div>
    </div>
  );
}