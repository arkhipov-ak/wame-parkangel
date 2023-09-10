import NavBar from "../NavBar";
import { YMaps, Map } from "@pbe/react-yandex-maps";
import styles from "./Review.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Container from "../common/Container";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useEffect } from "react";

const Review = () => {
  const snap = useSnapshot(state);
  const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";
  const queryParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const selectedAddress = queryParams.get("address");

  const renderParkingType = () => {
    let array = [];

    if (snap.parkDate.data.isUnderground) array.push("Подземная");
    if (snap.parkDate.data.isOutDoor) array.push("Открытая");
    if (snap.parkDate.data.isCovered) array.push("Крытая");
    if (snap.parkDate.data.isGarage) array.push("Гараж");

    return array.length ? array.join(", ") : "Не указан";
  };

  const renderElectroType = () => {
    let array = [];

    if (snap.parkDate.data.isVolts) array.push("220V");
    if (snap.parkDate.data.isElectroMobile) array.push("Электромобиль");
    if (snap.parkDate.data.isVoltsWithCharger) array.push("220V и зарядка электромобиля");
    if (snap.parkDate.data.isWithoutPower) array.push("Без электропитания");

    return array.length ? array.join(", ") : "Не указано";
  };

  const renderTime = () => {
    const dateStart = new Date(snap.parkDate.dateStartISO);
    const hoursStart = dateStart.getHours();
    const minutesStart = dateStart.getMinutes();

    const dateEnd = new Date(snap.parkDate.dateEndISO);
    const hoursEnd = dateEnd.getHours();
    const minutesEnd = dateEnd.getMinutes();

    return `${hoursStart}:${minutesStart}-${hoursEnd}:${minutesEnd}`;
  };

  useEffect(() => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
      return;
    }
  }, [snap.parkDate]);

  return (
    <>
      <NavBar />
      <Container>
        <div>
          <h2 className={styles.title}>Предпросмотр</h2>
          <div className={styles.wrapper_div}>
            <p className={styles.address}>{snap.parkDate.address}</p>
            <div className={styles.styles_container}>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Тип паркинга</span>
                <span className={styles.value}>{renderParkingType()}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Охрана</span>
                <span className={styles.value}>{snap.parkDate.data.isProtected ? "Да" : "Нет"}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Обогрев</span>
                <span className={styles.value}>{snap.parkDate.data.isHeated ? "Да" : "Нет"}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Для электромобилей</span>
                <span className={styles.value}>{renderElectroType()}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Время доступности</span>
                <span className={styles.value}>{renderTime()}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в час</span>
                <span className={styles.value}>
                  {snap.parkDate.data.priceHour ? `${snap.parkDate.data.priceHour} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в день</span>
                <span className={styles.value}>
                  {snap.parkDate.data.priceDay ? `${snap.parkDate.data.priceDay} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в неделю</span>
                <span className={styles.value}>
                  {snap.parkDate.data.priceWeek ? `${snap.parkDate.data.priceWeek} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в месяц</span>
                <span className={styles.value}>
                  {snap.parkDate.data.priceMonth ? `${snap.parkDate.data.priceMonth} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Имя</span>
                <span className={styles.value}>{"Имя"}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Номер телефона</span>
                <span className={styles.value}>{"Телефон"}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Telegram</span>
                <span className={styles.value}>{"Телега"}</span>
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
      </Container>
    </>
  );
};

export default Review;
