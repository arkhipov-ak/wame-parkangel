import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Logotype from "/src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";

const Home = () => {
  const snap = useSnapshot(state)
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const renderAgreementInfo = () => {
      if (!snap || !snap.user) return;
      else {
        if (snap.user.isAcceptAgreement) navigate("/search-time");
        else navigate("/agreement");
      }
    }
   
    const timer = setTimeout(() => renderAgreementInfo(), 2500)

    return () => {
      clearTimeout(timer);
    };
  }, [navigate, snap]);

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
