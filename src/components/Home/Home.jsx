import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Logotype from "/src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showErrorSnackbar } from "../../utils/showErrorSnackBar";

const Home = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.Telegram.WebApp.ready();
    const tg = window?.Telegram?.WebApp;
    tg.expand()

    const renderAgreementInfo = async () => {
      const user = tg.initDataUnsafe.user;
      if (user) {
        const chatId = user.id;
        await axios.get(`http://185.238.2.176:5064/api/users/chatId/${chatId}`)
          .then(response => {
            if (response.data.response.isAcceptAgreement) return navigate("/search-time");
            navigate("/agreement");
          })
          .catch(() => showErrorSnackbar({ message: "Что-то пошло не так", tryAgain: false }))
      }
    }
   
    const timer = setTimeout(() => renderAgreementInfo(), 2500)

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
      <img src={Logotype} alt="Логотип" onLoad={handleImageLoad} style={{ display: isImageLoaded ? "block" : "none" }} />
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
