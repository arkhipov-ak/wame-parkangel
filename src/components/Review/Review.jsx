import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { YMaps, Map } from "@pbe/react-yandex-maps";
import styles from "./Review.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
const Review = () => {
  const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";
  const { state } = useLocation();
  const navigate = useNavigate(); // Замените useHistory на useNavigate
  const queryParams = new URLSearchParams(window.location.search);
  const selectedAddress = queryParams.get("address");


  useEffect(() => {
    window.Telegram.WebApp.ready();
    const tg = window?.Telegram?.WebApp;
    const user = tg.initDataUnsafe.user;
    if (user) {
      const chatId = user.id;
      // todo ищем юзера в бд по chatId, если такого нет - создаем
    }
  }, []);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div>
          <p className={styles.review_text}>Предпросмотр</p>
          <div className={styles.wrapper_div}>
            <p className={styles.main_text}>{selectedAddress}</p>
            {/*// todo получить адрес */}
            <div className={styles.styles_container}>
              <div className={styles.styles_left}>
                <div>
                  <p>Тип паркинга</p>
                  <p>Охрана</p>
                  <p>Обогрев</p>
                  <p>Для электромобилей</p>
                  <p>Время доступности</p>
                  <p>Стоимость в час</p>
                  <p>Стоимость в день</p>
                  <p>Стоимость в неделю</p>
                  <p>Стоимость в месяц</p>
                  <p>Имя</p>
                  <p>Номер телефона</p>
                  <p>Telegram</p>
                </div>
              </div>
              <div className={styles.styles_right}>
                <p>{state?.activeParking}</p>
                <p>{state?.activeSecurity ? "Да" : "Нет"}</p>
                <p>{state?.activeHeating ? "Да" : "Нет"}</p>
                <p>{state?.active220V ? "220V" : "Нет"}</p>
                <p>{state?.activeElectricCar ? "Да" : "Нет"}</p>
                <p>
                  {state?.startingHour}:{state?.startingMinute}-
                  {state?.endingHour}:{state?.endingMinute}
                </p>
                <p>{state?.hoursCount} руб</p>
                <p>{state?.daysCount} руб</p>
                <p>{state?.weeksCount} руб</p>
                <p>{state?.monthsCount} руб</p>
                <p>Виктор</p>
                <p>+78006007775</p>
                <p>@MyName</p>
              </div>
            </div>
            <YMaps apiKey={API_KEY}>
              <Map
                width="100%"
                height="30vh"
                defaultState={{
                  center: [55.7558, 37.6173], // Координаты Москвы
                  zoom: 16,
                  type: "yandex#map",
                }}
                options={{
                  suppressMapOpenBlock: true, // Убирает блок "Открыть в Яндекс.Картах"
                  suppressYandexSearch: true,
                }}
              ></Map>
            </YMaps>
          </div>
          <Link className={styles.next}>Опубликовать</Link>
          <Link className={styles.return}>Вернуться</Link>
        </div>
      </div>
    </div>
  );
};

export default Review;
