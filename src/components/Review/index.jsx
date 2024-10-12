import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
import NavBar from 'src/components/NavBar'
import { state } from 'src/state'
import { API_KEY } from 'src/utils/constants'
import { renderDay, renderMinutes, renderMonth } from 'src/utils/functions'
import { showErrorSnackbar, showSuccessSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

import styles from './Review.module.css'

const Review = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(16);
  const [comment, setComment] = useState("");
  const [data, setData] = useState(null);

  const renderParkingType = () => {
    if (data.isUnderground) return "Подземная";
    if (data.isOutDoor) return "Открытая";
    if (data.isCovered) return "Крытая";
    if (data.isGarage) return "Гараж";

    return null;
  };

  const renderElectroType = () => {
    if (data.isVolts) return "220V";
    if (data.isSpecializedCharger) return "Специализированная зарядка";

    return null;
  };

  const renderTime = () => {
    const dateStart = new Date(snap.parkDate.dateStartISO);
    const hoursStart = dateStart.getHours();
    const minutesStart = renderMinutes(dateStart);

    const dateEnd = new Date(snap.parkDate.dateEndISO);
    const hoursEnd = dateEnd.getHours();
    const minutesEnd = renderMinutes(dateEnd);

    return `${hoursStart}:${minutesStart} - ${hoursEnd}:${minutesEnd}`;
  };

  const renderDate = () => {
    const dateStart = new Date(snap.parkDate.dateStartISO);
    const dayStart = renderDay(dateStart);
    const monthStart = renderMonth(dateStart);
    const yearStart = dateStart.getFullYear();

    if (snap.parkDate.hoursCountOneDay || snap.parkDate.hoursStartOneDay || snap.parkDate.minutesOneDay) {
      return `${dayStart}.${monthStart}.${yearStart}`;
    } //если сдаем на один день, то выводим одну дату

    const dateEnd = new Date(snap.parkDate.dateEndISO);
    const dayEnd = dateEnd.getDate();
    const monthEnd = renderMonth(dateEnd);
    const yearEnd = dateEnd.getFullYear();

    return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  };

  const onHandlePlusClick = () => setZoom(prevState => prevState + 1);

  const onHandleMinusClick = () => setZoom(prevState => prevState - 1);

  const onHandleClick = async () => {
    const preparedData = {
      ...data,
      id: data.ad_id,
      isRenewable: snap.parkDate.isRenewable,
      availabilityDateEnd: snap.parkDate.dateEndISO,
      availabilityDateStart: snap.parkDate.dateStartISO,
      user_id: snap.user.id,
      park_id: snap.parkDate.park_id,
      comment,
    };

    delete preparedData.ad_id;
    delete preparedData.user;
    delete preparedData.review;
    delete preparedData.tenant;
    delete preparedData.dateEnd;
    delete preparedData.dateEndISO;
    delete preparedData.dateStart;
    delete preparedData.dateStartISO;
    delete preparedData.hoursStart;
    delete preparedData.hoursEnd;
    delete preparedData.minutesStart;
    delete preparedData.minutesEnd;
    if (!preparedData.height) delete preparedData.height;
    if (!preparedData.width) delete preparedData.width;
    if (!preparedData.length) delete preparedData.length;
    if (!preparedData.priceHour) delete preparedData.priceHour;
    if (!preparedData.priceDay) delete preparedData.priceDay;
    if (!preparedData.priceWeek) delete preparedData.priceWeek;
    if (!preparedData.priceMonth) delete preparedData.priceMonth;

    if (snap.isEditPark) {
       await axios.put("https://api.parkangel.ru/api/ad", preparedData)
        .then((response) => {
          if (response) {
            showSuccessSnackbar({ message: "Объявление отредактировано" });
            navigate("/search-time");
          }
        }).catch(() => showErrorSnackbar({ message: "Не удалось отредактировать объявление"})
      );

      return; 
    }

    delete preparedData.id;

    await axios.post("https://api.parkangel.ru/api/ad", preparedData)
      .then((response) => {
        if (response) {
          showSuccessSnackbar({ message: "Объявление опубликовано" });
          navigate("/search-time");
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось опубликовать объявление"})
    );
  };

  useEffect(() => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
    }
  }, [snap.parkDate]);

  useEffect(() => {
    if (snap.isEditPark === null || snap.user === null || snap.parkDate === null) {
      showErrorSnackbar({ message: "Пожалуйста, повторите попытку" });
      return navigate("/search-time");
    }

    if (snap.isEditPark) {
      if (snap.parkDate.comment) setComment(snap.parkDate.comment)
      return setData({
        ...snap.parkDate,
        ...snap.options[0],
        coordinates: snap.parkDate.coordinates.join(", ")
      })
    }

    axios.get(`https://api.parkangel.ru/api/park/${snap.parkDate.park_id}`)
      .then((response) => setData(response.data.response))
      .catch(() => {
        showErrorSnackbar({ message: "Не удалось загрузить данные парковки", tryAgain: true });
        navigate("/search-time");
      })
  }, [snap.parkDate, snap.user, snap.isEditPark]);

  return (
    <>
      <NavBar />
      <Container>
          <h2 className={styles.title}>Ваше объявление</h2>
          {data && (
            <div style={{ width: "100%" }}>
              <div className={styles.wrapper_div}>
                <p className={styles.address}>{data.address}</p>
                <div className={styles.styles_container}>
                  {renderParkingType() && (
                    <div className={styles.content_wrapper}>
                      <span className={styles.label}>Тип паркинга</span>
                      <span className={styles.value}>{renderParkingType()}</span>
                    </div>
                  )}
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Охрана</span>
                    <span className={styles.value}>{data.isProtected ? "Да" : "Нет"}</span>
                  </div>
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Обогрев</span>
                    <span className={styles.value}>{data.isHeated ? "Да" : "Нет"}</span>
                  </div>
                  {renderElectroType() && (
                     <div className={styles.content_wrapper}>
                      <span className={styles.label}>Для электромобилей</span>
                      <span className={styles.value}>{renderElectroType()}</span>
                    </div>
                  )}
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
                      {data.priceHour ? `${data.priceHour} руб` : "Не указана"}
                    </span>
                  </div>
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Стоимость в день</span>
                    <span className={styles.value}>
                      {data.priceDay ? `${data.priceDay} руб` : "Не указана"}
                    </span>
                  </div>
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Стоимость в неделю</span>
                    <span className={styles.value}>
                      {data.priceWeek ? `${data.priceWeek} руб` : "Не указана"}
                    </span>
                  </div>
                  <div className={styles.content_wrapper}>
                    <span className={styles.label}>Стоимость в месяц</span>
                    <span className={styles.value}>
                      {data.priceMonth ? `${data.priceMonth} руб` : "Не указана"}
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
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Оставьте комментарий"
                    rows={3}
                    maxLength={200}
                    className={styles.comment}
                  />
                </div>
                {snap.parkDate.coordinates && (
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
                          center: snap.parkDate.coordinates,
                          zoom: zoom,
                          type: "yandex#map",
                        }}
                        options={{
                          suppressMapOpenBlock: true,
                          suppressYandexSearch: true,
                        }}
                      >
                        <Placemark geometry={snap.parkDate.coordinates}/>
                        <button
                            type="button"
                            onClick={onHandlePlusClick}
                            disabled={zoom >= 20}
                            className={styles.plus_button}
                          >
                          1
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
              <Button onClick={onHandleClick}>
                {snap.isEditPark ? "Редактировать" : "Опубликовать"}
              </Button>
            </div>
          )}
      </Container>
    </>
  );
};

export default Review;
