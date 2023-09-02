import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Logotype from "/src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
let tg = window.Telegram.WebApp;

const Home = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  tg.expand()
  useEffect(() => {
    tg.expand()
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  
  return (
    <div className={styles.wrapper}>
      {
        !isImageLoaded && (
          <div style={{
            width: '9.3125rem',
            height: '9.3125rem',
            borderRadius: '1.9375rem',
            background: '#353536'
          }} />
        )
      }
      <img src={Logotype} alt="Логотип" onLoad={handleImageLoad} style={{ display: isImageLoaded ? 'block' : 'none' }} />
      <p className={styles.text_main}>
        {isImageLoaded ? "Сервис по поиску  и сдаче машино-мест:" : "Загрузка..."}
      </p>
      <span className={styles.text_descr}>
        {isImageLoaded ? "от часа до года" : " "}
      </span>
    </div>
  );
};

export default Home;
