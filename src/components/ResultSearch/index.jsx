import NavBar from "../NavBar";
import styles from "./ResultSearch.module.css";
import location from "../../assets/location.svg";
import locationLight from "../../assets/location-light.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import { useEffect } from "react";
import axios from "axios";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import Container from "../common/Container";
import { useState } from "react";
import ZeroData from "../common/ZeroData";

const ResultSearch = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const renderTime = (item) => {
    const dateStart = new Date(item.availabilityDateStart);
    const hoursStart = dateStart.getHours();
    const minutesStart = (dateStart.getMinutes() + "").length === 1
      ? `0${dateStart.getMinutes()}`
      : dateStart.getMinutes()
    ;

    const dateEnd = new Date(item.availabilityDateEnd);
    const hoursEnd = dateEnd.getHours();
    const minutesEnd = (dateEnd.getMinutes() + "").length === 1
      ? `0${dateEnd.getMinutes()}`
      : dateEnd.getMinutes()
    ;

    return `${hoursStart}:${minutesStart} - ${hoursEnd}:${minutesEnd}`;
  };

  const renderRating = (item) => {
    if (item.length === 0) return "Недостаточно оценок";
    const ratings = item.map((elem) => elem.rating);
    return ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
  };

  const onHandleClick = (item) => {
    state.resultElement = { ...item };
    navigate(`/result-search/${item.id}`);
  }

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) {
      if (!snap.parkDate) {
        showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
        navigate("/search-time");
        return;
      }

      const preparedData = { ...snap.options[0] };

      if (snap.parkDate.hoursCountOneDay || snap.parkDate.hoursStartOneDay || snap.parkDate.minutesOneDay) {
        delete preparedData.priceDay;
        delete preparedData.priceWeek;
        delete preparedData.priceMonth;
      } // если ищем парковку на сегодня или на завтра, то нам не нужны поля цен на день, на неделю и на месяц

      delete preparedData.user;
      delete preparedData.user_id;
      delete preparedData.id;
      delete preparedData.createdAt;
      delete preparedData.updatedAt;
      if (!preparedData.height) delete preparedData.height;
      if (!preparedData.width) delete preparedData.width;
      if (!preparedData.length) delete preparedData.length;
      if (!preparedData.priceHour) delete preparedData.priceHour;
      if (!preparedData.priceDay) delete preparedData.priceDay;
      if (!preparedData.priceWeek) delete preparedData.priceWeek;
      if (!preparedData.priceMonth) delete preparedData.priceMonth;

      axios.post(
        "https://api.parkangel.ru/api/ad/park", preparedData
      ).then(response => setData(response.data.response))
      .catch(() => showErrorSnackbar({ message: "Не удалось получить объявления"}))
    }
  }, [snap.user, snap.options, navigate]);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className={styles.main_text}>Результаты поиска</h2>
        {data.length ? (
          <div style={{ width: "100%" }}>
            {data.map((item, index) => (
              <button
                type="button"
                onClick={() => onHandleClick(item)}
                key={index}
                className={styles.wrapper_rentCard}
              >
                <p className={styles.rent_location}>{item.park.address}</p>
                <div className={styles.secondRow}>
                  <span className={styles.rent_date}>
                    <img src={snap.user?.theme === "light" ? location : locationLight} /> 37 м
                  </span>
                  <span className={styles.rent_time}>{renderTime(item.park)}</span>
                  <span className={styles.rent_status}>{item.park.priceHour} руб/ч</span>
                </div>
                <p className={styles.rent_location}>Рейтинг: {renderRating(item.review)}</p>
              </button>
            ))}
            <Link to="/show-map-result" className={styles.submit}>
              Посмотреть все на карте
            </Link>
          </div>
        ) : (
            <ZeroData>Подходящие объявления не найдены</ZeroData>
        )}
      </Container>
    </>
  );
};

export default ResultSearch;
