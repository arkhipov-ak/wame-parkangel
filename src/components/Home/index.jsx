import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Logotype from "/src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { showErrorSnackbar } from "../../utils/showSnackBar";

const Home = () => {
  const snap = useSnapshot(state)
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const onHandleSubmit = (e) => {
    e.preventDefault();
    
    if (password === snap.user.password) {
      setOpenPasswordModal(false);
      navigate("/search-time");
    } else {
      showErrorSnackbar({ message: "Неверный пароль", tryAgain: true });
    }
  };

  const onHandleLoginClick = () => {
    console.log('click');
  };

  useEffect(() => {
    setLoading(true)
    /* console.log('home page'); */
    const renderAgreementInfo = () => {
      if (!snap.user) return setLoading(false);

      if (snap.user.password) {
        setOpenPasswordModal(true);
        return setLoading(false);
      }
      
      if (snap.user.isAcceptAgreement) navigate("/search-time");
      else navigate("/agreement");
    };
   
    const timer = setTimeout(() => renderAgreementInfo(), 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate, snap, openPasswordModal]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={styles.wrapper}>
      {
        !isImageLoaded && (
          <div style={{
            width: "9.3125rem",
            height: "9.3125rem",
            borderRadius: "1.9375rem",
            background: "#353536",
          }} />
        )
      }
      <img src={Logotype} alt="Логотип" onLoad={handleImageLoad} style={{ display: isImageLoaded ? "block" : "none" }} />
      <p className={styles.text_main}>
        {isImageLoaded ? "Сервис по поиску  и сдаче машино-мест:" : "Загрузка..."}
      </p>
      <span className={styles.text_descr}>
        {isImageLoaded ? "от часа до года" : " "}
      </span>
      {!loading && !snap.user && (
        <div className={styles.login_wrapper}>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value, "nickname")}
            placeholder="Введите Telegram-никнейм"
            className={styles.home_input}
            type="text"
          />
          <button
            type="button"
            onClick={onHandleLoginClick}
            className={styles.login_button}
          >
            Войти
          </button>
        </div>
      )}
      <Modal
        setOpenModal={setOpenPasswordModal}
        openModal={openPasswordModal}
        closeButton={false}
      >
        <form onSubmit={onHandleSubmit} className={styles.form}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value, "password")}
            placeholder="Введите пароль"
            className={styles.home_input}
            type="text"
          />
          <div className={styles.text_block}>
            <span>Забыли пароль?</span><br/>
            <a href="https://t.me/OlivsonM" className={styles.link}>Напишите в поддержку.</a>
          </div>
          <Button type="submit">Войти</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
