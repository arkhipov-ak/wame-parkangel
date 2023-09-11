import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Logotype from "/src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Modal from "../common/Modal";
import Button from "../common/Button";

const Home = () => {
  const snap = useSnapshot(state)
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const onHandleSubmit = () => {
    console.log('submit')
  }

  useEffect(() => {
    const renderAgreementInfo = () => {
      if (!snap || !snap.user) return;

      if (snap.user.password) {
        setOpenPasswordModal(true);
        return;
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

  console.log(snap);

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
      {openPasswordModal && (
        <Modal
          setOpenModal={setOpenPasswordModal}
          openModal={openPasswordModal}
          closeButton={false}
        >
          <form onSubmit={onHandleSubmit}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value, "password")}
              placeholder="Введите пароль"
              className={styles.password_input}
              type="text"
            />
            <span>Забыли пароль?</span> <a href="https://t.me/OlivsonM">Напишите в поддержку.</a>
            <Button type="submit">Войти</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Home;
