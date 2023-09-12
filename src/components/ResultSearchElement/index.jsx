import NavBar from "../NavBar";
import styles from "./ResultSearchElement.module.css";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Container from "../common/Container";
import { Map, YMaps } from "@pbe/react-yandex-maps";
import { useEffect } from "react";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useNavigate } from "react-router-dom";
import LinkButton from "../common/LinkButton";

const ResultSearchElement = () => {
  const snap = useSnapshot(state);
  const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";
  const navigate = useNavigate();
  console.log(snap);

  const renderParkingType = () => {
    let array = [];

    if (snap.resultElement.park.isUnderground) array.push("Подземная");
    if (snap.resultElement.park.isOutDoor) array.push("Открытая");
    if (snap.resultElement.park.isCovered) array.push("Крытая");
    if (snap.resultElement.park.isGarage) array.push("Гараж");

    return array.length ? array.join(", ") : "Не указан";
  };

  const renderElectroType = () => {
    let array = [];

    if (snap.resultElement.park.isVolts) array.push("220V");
    if (snap.resultElement.park.isElectroMobile) array.push("Электромобиль");
    if (snap.resultElement.park.isVoltsWithCharger) array.push("220V и зарядка электромобиля");
    if (snap.resultElement.park.isWithoutPower) array.push("Без электропитания");

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

  useEffect(() => {
    console.log('in use effect');
    if (!snap.resultElement) {
      showErrorSnackbar({ message: "Пожалуйста, повторите попытку" });
      navigate("/search-time");
    }
  }, [snap, snap.user, snap.resultElement]);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className={styles.title}>Выбранная парковка</h2>
        <div style={{ width: "100%" }}>
          <div className={styles.wrapper_div}>
            <p className={styles.address}>{snap.resultElement.park.address}</p>
            <div className={styles.styles_container}>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Тип паркинга</span>
                <span className={styles.value}>{renderParkingType()}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Охрана</span>
                <span className={styles.value}>{snap.resultElement.park.isProtected ? "Да" : "Нет"}</span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Обогрев</span>
                <span className={styles.value}>{snap.resultElement.park.isHeated ? "Да" : "Нет"}</span>
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
                  {snap.resultElement.park.priceHour ? `${snap.resultElement.park.priceHour} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в день</span>
                <span className={styles.value}>
                  {snap.resultElement.park.priceDay ? `${snap.resultElement.park.priceDay} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в неделю</span>
                <span className={styles.value}>
                  {snap.resultElement.park.priceWeek ? `${snap.resultElement.park.priceWeek} руб` : "Не указана"}
                </span>
              </div>
              <div className={styles.content_wrapper}>
                <span className={styles.label}>Стоимость в месяц</span>
                <span className={styles.value}>
                  {snap.resultElement.park.priceMonth ? `${snap.resultElement.park.priceMonth} руб` : "Не указана"}
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
              {snap.user.isShowTelegram && (
                <div className={styles.content_wrapper}>
                  <span className={styles.label}>Telegram</span>
                  <span className={styles.value}>{snap.user.telegram}</span>
                </div>
              )}
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
          <div className={styles.buttons_wrapper}>
            <LinkButton href={`https://t.me/${snap.resultElement.user.telegram}`}>Написать в Telegram</LinkButton>
            <LinkButton href={`tel:${snap.resultElement.user.phoneNumber}`}>Позвонить</LinkButton>
            <button type="button" onClick={() => {}} className={styles.review_button}>Оставить отзыв</button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ResultSearchElement;
