import React, { useState } from "react";
import styles from "./NavBar.module.css";
import ParkAngel from "/src/assets/ParkAngel.svg";
import { AiOutlineLeft } from "react-icons/ai";
import { BiAlignRight } from "react-icons/bi";
import { useNavigate, useLocation, Link } from 'react-router-dom';


const NavBar = () => {

  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
     if (location.state && location.state.from) {
        navigate(location.state.from);
     } else {
        navigate(-1);  // Назад по истории браузера
     }
  }


  return (
    <nav className={styles.wrapper}>
      <button onClick={handleGoBack} className={styles.return__btn}>
        <AiOutlineLeft
          style={{
            color: "#192342",
            width: "60%",
            height: "60%",
          }}
        />
      </button>
      <img className={styles.logo} src={ParkAngel} />
      <button
        className={styles.option__btn}
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        <BiAlignRight
          style={{
            color: "#192342",
            width: "60%",
            height: "60%",
          }}
        />
      </button>

      {isMenuOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setMenuOpen(false)}
          ></div>
          <div
            className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ""}`}
          >
            <div className={styles.wrapper_text}>
              <Link className={styles.linkfor} to="/home">На главную</Link>
              <Link className={styles.linkfor} to="/PersonalArea">Личный кабинет</Link>
              <Link className={styles.linkfor} to="/faq">Частые вопросы</Link>
              <Link className={styles.linkfor} to="/AboutService">О сервисе</Link>
              <Link className={styles.linkfor} to="/home">Связь с поддержкой</Link>
              <Link className={styles.linkfor} to="/profile">
                Пользовательское <br /> соглашение
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
