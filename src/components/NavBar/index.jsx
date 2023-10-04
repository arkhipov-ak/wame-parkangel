import { useState } from "react";
import styles from "./NavBar.module.css";
import parkAngel from "/src/assets/park-angel.svg";
import parkAngelDark from "/src/assets/park-angel-dark.svg";
import { AiOutlineLeft } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import axios from "axios";
import { showErrorSnackbar, showSuccessSnackbar } from "../../utils/showSnackBar";

const NavBar = () => {
  const snap = useSnapshot(state);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
     if (location.state && location.state.from) navigate(location.state.from);
     else navigate(-1);
  };

  const onHandleThemeClick = (theme) => {
    axios.put("https://api.parkangel.ru/api/users", {...snap.user, theme: theme})
    .then(() => {
      showSuccessSnackbar({ message: "Тема обновлена" })
      axios.get(`https://api.parkangel.ru/api/users/chatId/${snap.user.chatId}`)
        .then((response) => {
          if (response.data.response) state.user = response.data.response;
        }).catch(() => showErrorSnackbar({ message: "Не удалось получить данные юзера" }))
    })
    .catch(() => showErrorSnackbar({ message: "Не удалось обновить данные профиля" }))
  };

  return (
    <nav className={styles.wrapper}>
      {location.pathname !== "/search-time" && (
        <button type="button" onClick={handleGoBack} className={styles.menu_btn}>
          <AiOutlineLeft className={styles.icon}/>
        </button>
      )}
      <img className={styles.logo} src={snap.user?.theme === "light" ? parkAngel : parkAngelDark} alt="logo"/>
      <button
        type="button"
        className={styles.menu_btn}
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        <BiMenuAltLeft className={styles.icon}/>
      </button>

      {isMenuOpen && (
        <>
          <div className={styles.overlay} onClick={() => setMenuOpen(false)}/>
          <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ""}`}>
            <div className={styles.wrapper_text}>
              <Link className={styles.linkfor} to="/search-time">На главную</Link>
              <Link className={styles.linkfor} to="/personal-area">Личный кабинет</Link>
              <Link className={styles.linkfor} to="/faq">Частые вопросы</Link>
              <Link className={styles.linkfor} to="/about-service">О сервисе</Link>
              <a className={styles.linkfor} href="https://t.me/OlivsonM">Связь с поддержкой</a>
              <Link className={styles.linkfor} to="/agreement">
                Пользовательское <br /> соглашение
              </Link>
              <button
                type="button"
                onClick={() => onHandleThemeClick(snap.user.theme === "light" ? "dark" : "light")}
                className={styles.linkfor}
              >
                Включить {snap.user?.theme === "light" ? "темную" : "светлую"} тему
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
