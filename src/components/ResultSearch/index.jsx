import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnapshot } from "valtio";
import { Rate } from "antd";

import styles from "./ResultSearch.module.css";
import NavBar from "src/components/NavBar";
import location from "src/assets/location.svg";
import locationLight from "src/assets/location-light.svg";
import { state } from "src/state";
import { showErrorSnackbar } from "src/utils/showSnackBar";
import Container from "src/components/common/Container";
import ZeroData from "src/components/common/ZeroData";
import ModalReviews from "src/components/common/ModalReviews";

const ResultSearch = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [reviews, setReviews] = useState(null);

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
    const ratings = item.map((elem) => elem.rating);
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2);
  };

  const onHandleClick = (item) => {
    if (!openReviewsModal) {
      state.resultElement = { ...item };
      navigate(`/result-search/${item.id}`);
    }
  };

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) {
      if (!snap.parkDate) {
        showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
        navigate("/search-time");
        return;
      }

      const preparedData = { ...snap.options[0], coordinates: snap.options[0].coordinates.join(", ") };

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
      delete preparedData.address;
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
  }, []);

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
                onClick={() => onHandleClick(item.ad)}
                key={index}
                className={styles.wrapper_rentCard}
              >
                <p className={styles.rent_location}>{item.ad.park.address}</p>
                <div className={styles.secondRow}>
                  <span className={styles.rent_date}>
                    <img src={snap.user?.theme === "light" ? location : locationLight} /> {item.distance} м
                  </span>
                  <span className={styles.rent_time}>{renderTime(item.ad.park)}</span>
                  <span className={styles.rent_status}>{item.ad.park.priceHour} руб/ч</span>
                </div>
                {!!item.ad.review.length && (
                  <>
                    <Rate
                      allowHalf
                      disabled
                      value={renderRating(item.ad.review)}
                      style={{ fontSize: "30px" }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReviews(item.ad.review);
                        setOpenReviewsModal(true);
                      }}
                      className={styles.reviews_button}
                    >
                      <span className={styles.reviews_button_text}>Посмотреть отзывы</span>
                    </button>
                  </>
                )}
                {!!item.ad.comment && (
                  <p className={styles.rent_location}>{item.ad.comment}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
            <ZeroData>
              Подходящие объявления не найдены. Попробуйте изменить параметры поиска и убедитесь, что вы правильно указали адрес, где вам нужно припарковаться.
            </ZeroData>
        )}
        {openReviewsModal && (
          <ModalReviews
            reviews={reviews}
            totalRating={renderRating(reviews)}
            openReviewsModal={openReviewsModal}
            setOpenReviewsModal={setOpenReviewsModal}
          />
        )}
      </Container>
    </>
  );
};

export default ResultSearch;
