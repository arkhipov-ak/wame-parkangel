import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { Rate } from "antd";
import axios from "axios";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

import styles from "./ResultSearchElement.module.css";
import NavBar from "src/components/NavBar";
import { state } from "src/state";
import Container from "src/components/common/Container";
import { showErrorSnackbar, showSuccessSnackbar } from "src/utils/showSnackBar";
import LinkButton from "src/components/common/LinkButton";
import Modal from "src/components/common/Modal";
import Button from "src/components/common/Button";
import { API_KEY, telegramToken } from "src/utils/constants";

const ResultSearchElement = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [zoom, setZoom] = useState(16);
  const [rating, setRating] = useState(2.5);
	const [comment, setComment] = useState("");

  const onHandlePhoneButtonClick = () => window.open(`tel:${snap.resultElement.user.phoneNumber}`);

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
      const dateStart = new Date(snap.resultElement.park.availabilityDateStart);
      const hoursStart = dateStart.getHours();
      const minutesStart = (dateStart.getMinutes() + "").length === 1
        ? `0${dateStart.getMinutes()}`
        : dateStart.getMinutes()
      ;
  
      const dateEnd = new Date(snap.resultElement.park.availabilityDateEnd);
      const hoursEnd = dateEnd.getHours();
      const minutesEnd = (dateEnd.getMinutes() + "").length === 1
        ? `0${dateEnd.getMinutes()}`
        : dateEnd.getMinutes()
      ;
  
      return `${hoursStart}:${minutesStart} - ${hoursEnd}:${minutesEnd}`;
  };

  const renderDate = () => {
      const dateStart = new Date(snap.resultElement.park.availabilityDateStart);
      const dayStart = (dateStart.getDate() + "").length === 1
        ? `0${dateStart.getDate()}`
        : dateStart.getDate()
      ;
      const monthStart = (dateStart.getMonth() + 1 + "").length === 1 
        ? `0${dateStart.getMonth() + 1}`
        : dateStart.getMonth() + 1
      ;
      const yearStart = dateStart.getFullYear();
  
      if (snap.resultElement.park.availabilityDateStart.slice(0, 10) === snap.resultElement.park.availabilityDateEnd.slice(0, 10)) {
        return `${dayStart}.${monthStart}.${yearStart}`;
      } //если сдаем на один день, то выводим одну дату
  
      const dateEnd = new Date(snap.resultElement.park.availabilityDateEnd);
      const dayEnd = dateEnd.getDate();
      const monthEnd = (dateEnd.getMonth() + 1 + "").length === 1 
        ? `0${dateEnd.getMonth() + 1}`
        : dateEnd.getMonth() + 1
      ;
      const yearEnd = dateEnd.getFullYear();
  
      return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  };

  const onHandlePlusClick = () => setZoom(prevState => prevState + 1);

  const onHandleMinusClick = () => setZoom(prevState => prevState - 1);

  console.log(snap);

  const handleSendBtn = () => {
		axios.post(
      "https://api.parkangel.ru/api/review",
      { rating, message: comment, ad_id: snap.resultElement.id, user_id: snap.user.id }
    ).then((response) => {
      if (response) {
        axios.get(
          `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${snap.resultElement.user.chatId}&text=${comment}&rating=${rating}`
        ).then(() => showSuccessSnackbar({ message: "Ваш отзыв отправлен в Telegram. Спасибо!" })
        ).catch(() => showErrorSnackbar({ message: "Не удалось отправить ваш отзыв в Telegram" }))
        showSuccessSnackbar({ message: "Отзыв оставлен успешно" });
        setOpenModal(false);
      }
    }).catch(() => showErrorSnackbar({ message: "Не удалось записать отзыв" }))
	}

  useEffect(() => {
    if (!snap.resultElement) {
      showErrorSnackbar({ message: "Пожалуйста, повторите попытку" });
      navigate("/search-time");
    }
  }, [snap.resultElement]);

  return (
    <>
      <NavBar />
      <Container>
        {snap.resultElement && (
          <>
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
                      {snap.resultElement?.park.priceWeek ? `${snap.resultElement?.park.priceWeek} руб` : "Не указана"}
                    </span>
                  </div>
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Стоимость в месяц</span>
                    <span className={styles.value}>
                      {snap.resultElement.park.priceMonth ? `${snap.resultElement.park.priceMonth} руб` : "Не указана"}
                    </span>
                  </div>
                  {snap.resultElement.user.isShowName && (
                    <div className={styles.content_wrapper}>
                      <span className={styles.label}>Имя</span>
                      <span className={styles.value}>{snap.resultElement.user.name}</span>
                    </div>
                  )}
                  {snap.resultElement.user.isShowPhoneNumber && (
                    <div className={styles.content_wrapper}>
                      <span className={styles.label}>Номер телефона</span>
                      <span className={styles.value}>{snap.resultElement.user.phoneNumber}</span>
                    </div>
                  )}
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Telegram</span>
                    <span className={styles.value}>{snap.resultElement.user.telegram}</span>
                  </div>
                </div>
                {snap.options[0].coordinates && (
                    <div style={{ position: "relative", width:"100%", height:"30vh" }}>
                      <YMaps apiKey={API_KEY}>
                        <Map
                          width="100%"
                          height="30vh"
                          instanceRef={ref => {
                            ref &&
                            ref.behaviors.disable("drag") &&
                            ref.behaviors.disable("scrollZoom") &&
                            ref.behaviors.disable("dblClickZoom") &&
                            ref.behaviors.disable("multiTouch")
                          }}
                          state={{
                            center: snap.options[0].coordinates,
                            zoom: zoom,
                            type: "yandex#map",
                          }}
                          options={{
                            suppressMapOpenBlock: true,
                            suppressYandexSearch: true,
                          }}
                        >
                          <Placemark geometry={snap.options[0].coordinates}/>
                          <button
                            type="button"
                            onClick={onHandlePlusClick}
                            disabled={zoom >= 20}
                            className={styles.plus_button}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={onHandleMinusClick}
                            disabled={zoom <= 8}
                            className={styles.minus_button}
                          >
                            -
                          </button>
                        </Map>
                      </YMaps>
                    </div>
                )}
              </div>
              <div className={styles.buttons_wrapper}>
                <LinkButton href={`https://t.me/${snap.resultElement.user.telegram}`}>Написать в Telegram</LinkButton>
                {snap.resultElement.user.isShowPhoneNumber && (
                  <Button onClick={onHandlePhoneButtonClick}>Позвонить</Button>
                )}
                <button type="button" onClick={() => setOpenModal(true)} className={styles.review_button}>Оставить отзыв</button>
              </div>
            </div>
            {openModal && (
              <Modal openModal={openModal} setOpenModal={setOpenModal} title="Как все прошло?">
                <Rate
                  allowHalf
                  value={rating}
                  onChange={value => setRating(value)}
                  style={{ fontSize: "36px" }}
                />
                <p className={styles.description}>Ваш отзыв</p>
                <textarea
                  className={styles.textarea_style}
                  placeholder="Опишите ваш опыт"
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={5}
                />
                <Button onClick={handleSendBtn} className={styles.submit}>Отправить</Button>
              </Modal>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default ResultSearchElement;
