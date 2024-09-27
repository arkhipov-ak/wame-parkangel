import parkAngelDark from '/src/assets/park-angel-dark.svg'
import parkAngel from '/src/assets/park-angel.svg'
import { useState } from 'react'
import { AiOutlineLeft } from 'react-icons/ai'
import { BiMenu } from 'react-icons/bi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import { state } from 'src/state'
import { supportLink } from 'src/utils/constants'
import { showErrorSnackbar, showSuccessSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

import styles from './NavBar.module.css'

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
      state.user = {...snap.user, theme: theme}
    })
    .catch(() => showErrorSnackbar({ message: "Не удалось обновить данные профиля" }))
  };

  return (
    <nav className={styles.wrapper}>
      {location.pathname !== "/search-time" && location.pathname !== "/admin/info" && (
        <button type="button" onClick={handleGoBack} className={styles.menu_btn}>
          <AiOutlineLeft className={styles.icon}/>
        </button>
      )}
      <img className={styles.logo} src={snap.user?.theme === "light" ? parkAngel : parkAngelDark} alt="logo"/>
      {location.pathname !== "/admin/info" && (
        <button
          type="button"
          className={styles.menu_btn}
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <BiMenu className={styles.icon}/>
        </button>
      )}
      {isMenuOpen && (
        <>
          <div className={styles.overlay} onClick={() => setMenuOpen(false)}/>
          <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ""}`}>
            <div className={styles.wrapper_text}>
              <Link className={styles.linkfor} to="/search-time" onClick={() => setMenuOpen(false)}>На главную</Link>
              <Link className={styles.linkfor} to="/personal-area"onClick={() => setMenuOpen(false)}>Личный кабинет</Link>
              <Link className={styles.linkfor} to="/faq"onClick={() => setMenuOpen(false)}>Частые вопросы</Link>
              <Link className={styles.linkfor} to="/about-service"onClick={() => setMenuOpen(false)}>О сервисе</Link>
              <a className={styles.linkfor} href={supportLink}onClick={() => setMenuOpen(false)}>Связь с поддержкой</a>
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
