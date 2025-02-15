import parkAngelDark from '/src/assets/park-angel-dark.svg'
import parkAngel from '/src/assets/park-angel.svg'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import Button from 'src/components/common/Button'
import { state } from 'src/state'
import { showErrorSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

import styles from './Agreement.module.css'

const Agreement = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [date, setDate] = useState(null);

  const handleImageLoad = () => setImageLoaded(true);

  const handleAgreementClick = () => {
    const today = new Date();
    
    axios.put("https://api.parkangel.ru/api/users", { 
      ...snap.user,
      isAcceptAgreement: true,
      dateAcceptAgreement: today.toISOString(),
    }).then((response) => {
      if (response.data.response) {
        state.user = { ...snap.user, isAcceptAgreement: true, dateAcceptAgreement: today.toISOString() };
        navigate("/search-time");
      }
    }).catch(() => showErrorSnackbar({ message: "Не удалось записать согласие" }))
  };

  useEffect(() => {
    if (snap && snap.user && snap.user.dateAcceptAgreement) {
      let date = new Date(snap.user.dateAcceptAgreement);
      let day = (date.getDate() + "").length === 1 ? `0${date.getDate()}` : date.getDate();
      let month = (date.getMonth() + 1 + "").length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      let year = date.getFullYear();
      setDate(`${day}.${month}.${year}`);
    }
  }, [snap.user, snap.user.dateAcceptAgreement]);

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
          src={snap.user?.theme === "light" ? parkAngel : parkAngelDark}
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
            {date && (
              <span className={styles.date}>Дата принятия соглашения: {date}</span>
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
