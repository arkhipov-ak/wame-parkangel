import { useState } from "react";
import styles from "./NavBar.module.css";
import parkAngel from "/src/assets/ParkAngel.svg";
import { AiOutlineLeft } from "react-icons/ai";
import { BiAlignRight } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
     if (location.state && location.state.from) {
        navigate(location.state.from);
     } else {
        navigate(-1);
     }
  };

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
      <img className={styles.logo} src={parkAngel} />
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
              <Link className={styles.linkfor} to="/search-time">На главную</Link>
              <Link className={styles.linkfor} to="/personal-area">Личный кабинет</Link>
              <Link className={styles.linkfor} to="/faq">Частые вопросы</Link>
              <Link className={styles.linkfor} to="/about-service">О сервисе</Link>
              <a className={styles.linkfor} href="https://t.me/OlivsonM">Связь с поддержкой</a>
              <Link className={styles.linkfor} to="/agreement">
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
