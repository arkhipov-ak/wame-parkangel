import NavBar from "../NavBar";
import { YMaps, Map } from "@pbe/react-yandex-maps";
import styles from "./Review.module.css";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Container from "../common/Container";
import { showErrorSnackbar, showSuccessSnackbar } from "../../utils/showSnackBar";
import { useEffect } from "react";
import Button from "../common/Button";
import axios from "axios";
import { API_KEY } from "../../utils/constants";

const Review = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  const renderParkingType = () => {
    let array = [];

    if (snap.options[0]?.isUnderground) array.push("Подземная");
    if (snap.options[0]?.isOutDoor) array.push("Открытая");
    if (snap.options[0]?.isCovered) array.push("Крытая");
    if (snap.options[0]?.isGarage) array.push("Гараж");

    return array.length ? array.join(", ") : "Не указан";
  };

  const renderElectroType = () => {
    let array = [];

    if (snap.options[0]?.isVolts) array.push("220V");
    if (snap.options[0]?.isElectroMobile) array.push("Электромобиль");
    if (snap.options[0]?.isVoltsWithCharger) array.push("220V и зарядка электромобиля");
    if (snap.options[0]?.isWithoutPower) array.push("Без электропитания");

    return array.length ? array.join(", ") : "Не указано";
  };

  const renderTime = () => {
    const dateStart = new Date(snap.parkDate.dateStartISO);
    const hoursStart = dateStart.getHours();
    const minutesStart = (dateStart.getMinutes() + "").length === 1
      ? `0${dateStart.getMinutes()}`
      : dateStart.getMinutes()
    ;

    const dateEnd = new Date(snap.parkDate.dateEndISO);
    const hoursEnd = dateEnd.getHours();
    const minutesEnd = (dateEnd.getMinutes() + "").length === 1
      ? `0${dateEnd.getMinutes()}`
      : dateEnd.getMinutes()
    ;

    return `${hoursStart}:${minutesStart} - ${hoursEnd}:${minutesEnd}`;
  };

  const renderDate = () => {
    const dateStart = new Date(snap.parkDate.dateStartISO);
    const dayStart = dateStart.getDate();
    const monthStart = (dateStart.getMonth() + 1 + "").length === 1 
      ? `0${dateStart.getMonth() + 1}`
      : dateStart.getMonth() + 1
    ;
    const yearStart = dateStart.getFullYear();

    if (snap.parkDate.hoursCountOneDay || snap.parkDate.hoursStartOneDay || snap.parkDate.minutesOneDay) {
      return `${dayStart}.${monthStart}.${yearStart}`;
    } //если сдаем на один день, то выводим одну дату

    const dateEnd = new Date(snap.parkDate.dateEndISO);
    const dayEnd = dateEnd.getDate();
    const monthEnd = (dateEnd.getMonth() + 1 + "").length === 1 
      ? `0${dateEnd.getMonth() + 1}`
      : dateEnd.getMonth() + 1
    ;
    const yearEnd = dateEnd.getFullYear();

    return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  };

  const onHandleClick = () => {
    const preparedData = {
      ...snap.options[0],
      isRenewable: snap.parkDate.isRenewable,
      availabilityDateEnd: snap.parkDate.dateEndISO,
      availabilityDateStart: snap.parkDate.dateStartISO,
      user_id: snap.user.id,
      park_id: snap.parkDate.park_id,
    };

    delete preparedData.id;
    delete preparedData.user;
    if (!preparedData.height) delete preparedData.height;
    if (!preparedData.width) delete preparedData.width;
    if (!preparedData.length) delete preparedData.length;
    if (!preparedData.priceHour) delete preparedData.priceHour;
    if (!preparedData.priceDay) delete preparedData.priceDay;
    if (!preparedData.priceWeek) delete preparedData.priceWeek;
    if (!preparedData.priceMonth) delete preparedData.priceMonth;

    /* console.log('preparedData', preparedData); */

    axios.post("https://parkangel-backend.protomusic.ru/api/ad", preparedData)
      .then((response) => {
        if (response) {
          showSuccessSnackbar({ message: "Объявление опубликовано" });
          navigate("/search-time");
        }
      })
      .catch(() => showErrorSnackbar({ message: "Не удалось опубликовать объявление"})
    );
  };

  useEffect(() => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
    }
  }, [snap.parkDate]);

  useEffect(() => {
    axios.get(`https://parkangel-backend.protomusic.ru/api/options/userId/${snap.user.id}`)
      .then((response) => state.options = response.data.response)
      .catch(() => {
        showErrorSnackbar({ message: "Не удалось загрузить опции", tryAgain: true });
        navigate("/search-time");
      })
  }, [navigate, snap.user.id]);

  console.log(snap);

  return (
    <>
      <NavBar />
      <Container>
          <h2 className={styles.title}>Предпросмотр</h2>
          <div style={{ width: "100%" }}>
            <div className={styles.wrapper_div}>
              <p className={styles.address}>{snap.options[0]?.address}</p>
              <div className={styles.styles_container}>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Тип паркинга</span>
                  <span className={styles.value}>{renderParkingType()}</span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Охрана</span>
                  <span className={styles.value}>{snap.options[0]?.isProtected ? "Да" : "Нет"}</span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Обогрев</span>
                  <span className={styles.value}>{snap.options[0]?.isHeated ? "Да" : "Нет"}</span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Для электромобилей</span>
                  <span className={styles.value}>{renderElectroType()}</span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Дата доступности</span>
                  <span className={styles.value}>{renderDate()}</span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Время доступности</span>
                  <span className={styles.value}>{renderTime()}</span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Стоимость в час</span>
                  <span className={styles.value}>
                    {snap.options[0]?.priceHour ? `${snap.options[0]?.priceHour} руб` : "Не указана"}
                  </span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Стоимость в день</span>
                  <span className={styles.value}>
                    {snap.options[0]?.priceDay ? `${snap.options[0]?.priceDay} руб` : "Не указана"}
                  </span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Стоимость в неделю</span>
                  <span className={styles.value}>
                    {snap.options[0]?.priceWeek ? `${snap.options[0]?.priceWeek} руб` : "Не указана"}
                  </span>
                </div>
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Стоимость в месяц</span>
                  <span className={styles.value}>
                    {snap.options[0]?.priceMonth ? `${snap.options[0]?.priceMonth} руб` : "Не указана"}
                  </span>
                </div>
                {snap.user.isShowName && (
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Имя</span>
                    <span className={styles.value}>{snap.user.name}</span>
                  </div>
                )}
                {snap.user.isShowPhoneNumber && (
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Номер телефона</span>
                    <span className={styles.value}>{snap.user.phoneNumber}</span>
                  </div>
                )}
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Telegram</span>
                  <span className={styles.value}>{snap.user.telegram}</span>
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
            <Button onClick={onHandleClick}>Опубликовать</Button>
          </div>
      </Container>
    </>
  );
};

export default Review;
