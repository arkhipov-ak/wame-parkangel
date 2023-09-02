import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Profile.module.css";
import ParkAngel from "/src/assets/ParkAngel.svg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isImageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const [shouldShowContinueButton, setShouldShowContinueButton] = useState(false);

  const handleRedirect = () => {
    navigate("/home");
  };

  useEffect(() => {
    // Здесь производится запрос к API
    axios.get("/api/sogl")
      .then(response => {
        // Если ответ от API равен true, показываем новый текст кнопки
        if (response.data === true) {
          setShouldShowContinueButton(true);
        }
      })
      .catch(error => {
        console.error("Error fetching data from API:", error);
      });
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {!isImageLoaded && (
          <div
            style={{
              width: "10rem",
              borderRadius: "1.9375rem",
              background: "#0000",
              marginBottom: "10%",
            }}
          />
        )}
        <img
          className={styles.logotype}
          src={ParkAngel}
          onLoad={handleImageLoad}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />

        <div className={styles.text_wrapper}>
          <p className={styles.main_text}>
            Пользовательское <br /> соглашение
          </p>
          <p className={styles.descr_text}>
            Вы можете посещать данный сайт, не давая о себе никакой личной
            информации. Тем не менее, могут возникнуть ситуации, когда мы можем
            запросить Ваши личные данные. Мы всегда стараемся сообщить Вам
            заранее, прежде чем запрашивать личную информацию через Интернет.
          </p>
          <p className={styles.descr_text}>
            Наш сайт собирает информацию о посетителях с помощью Яндекс Метрика,
            где фиксируется только информация об интернет-провайдере посетителя
            и адрес интернет-страницы, с которого посетитель пришел на наш сайт.
            Результаты только собираются для статистики и ни в коем случае
            никуда не отправляются.
          </p>
          <p className={styles.descr_text}>
            Собранные данные, в том числе личная информация, не будут проданы
            или предоставлены третьим лицам. Вы всегда можете сделать запрос на
            удаление Вашей информации из нашей базы данных.
          </p>
        </div>
        {shouldShowContinueButton ? (
          <button onClick={handleRedirect} className={styles.submit}>
            Продолжить
          </button>
        ) : (
          <button onClick={handleRedirect} className={styles.submit}>
            Я согласен
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
