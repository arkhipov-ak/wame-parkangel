import { useState } from "react";
import styles from "./Agreement.module.css";
import parkAngel from "/src/assets/ParkAngel.svg";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import axios from "axios";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useSnapshot } from "valtio";
import { state } from "../../state";

const Agreement = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [isImageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleAgreementClick = () => {
    axios.put("https://parkangel-backend.protomusic.ru/api/users", { ...snap.user, isAcceptAgreement: true })
      .then((response) => {
        if (response.data.response) {
          state.user = { ...snap.user, isAcceptAgreement: true };
          navigate("/search-time");
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось записать согласие" }))
  };

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
          src={parkAngel}
          onLoad={handleImageLoad}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />
        <div className={styles.text_wrapper}>
          <p className={styles.main_text}>
            Пользовательское соглашение
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
        {snap.user.isAcceptAgreement ? (
          <>
            <Button onClick={() => navigate(-1)}>
              Вернуться
            </Button>
            {snap.user.dateAcceptAgreement && (
              <span style={{ marginTop: "20px" }}>Дата принятия соглашения: {snap.user.dateAcceptAgreement}</span>
            )}
          </>
        ) : (
          <Button onClick={handleAgreementClick}>
            Я согласен
          </Button>
        )}
      </div>
    </div>
  );
};

export default Agreement;
