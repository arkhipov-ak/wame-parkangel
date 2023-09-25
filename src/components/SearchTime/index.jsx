import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import SelectSearchGive from "../SelectSearchGive";
import TodayImg from "../../assets/today_img.svg";
import TomorrowImg from "../../assets/tomorrow_image.svg";
import FouinImg from "../../assets/fouin_img.svg";
import styles from "./SearchTime.module.css";
import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import ZeroData from "../common/ZeroData";

const SearchTime = () => {
  const snap = useSnapshot(state);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [myAds, setMyAds] = useState([]);

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

    const renderDate = (item) => {
    const dateStart = new Date(item.availabilityDateStart);
    const dayStart = (dateStart.getDate() + ""). length === 1
      ? `0${dateStart.getDate()}`
      : dateStart.getDate()
    ;
    const monthStart = (dateStart.getMonth() + 1 + "").length === 1 
      ? `0${dateStart.getMonth() + 1}`
      : dateStart.getMonth() + 1
    ;
    const yearStart = dateStart.getFullYear();

    const dateEnd = new Date(item.availabilityDateEnd);
    const dayEnd = dateEnd.getDate();
    const monthEnd = (dateEnd.getMonth() + 1 + "").length === 1 
      ? `0${dateEnd.getMonth() + 1}`
      : dateEnd.getMonth() + 1
    ;
    const yearEnd = dateEnd.getFullYear();

    if (`${dayStart}.${monthStart}.${yearStart}` === `${dayEnd}.${monthEnd}.${yearEnd}`) return `${dayStart}.${monthStart}.${yearStart}`;

    return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  };

  const renderRating = (item) => {
    if (!item.length) return "Оценок нет";
    const ratings = item.map((elem) => elem.rating);
    return ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
  };

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`https://parkangel-backend.protomusic.ru/api/ad/userId/${snap.user.id}`)
        .then((response) => setMyAds(response.data.response))
        .catch(() => showErrorSnackbar({ message: "Не удалось получить историю аренды" }))
    }
  }, [snap]);

  useEffect(() => {
    state.isSearchPark = true;
  }, []);

  return (
    <>
      <NavBar/>
      <Container>
        <SelectSearchGive/>
        <div className={styles.wrapper_cards}>
          <Link
            to={snap.isSearchPark === true ? "/search-today" : "/choose-time-today"}
            className={styles.card_today}
          >
            {!isImageLoaded && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.9375rem",
                  background: "#0000",
                }}
              />
            )}
            <img
              className={styles.img_today}
              src={TodayImg}
              onLoad={() => setImageLoaded(true)}
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
            <p className={styles.text_today}>На сегодня</p>
          </Link>
          <Link
            to={snap.isSearchPark === true ? "/search-tomorrow" : "/choose-time-tomorrow"}
            className={styles.card_today}
          >
            {!isImageLoaded && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.9375rem",
                  background: "#0000",
                }}
              />
            )}
            <img
              className={styles.img_today}
              src={TomorrowImg}
              onLoad={() => setImageLoaded(true)}
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
            <p className={styles.text_today}>На завтра</p>
          </Link>
          <Link
            to={snap.isSearchPark === true ? "/search-another-time" : "/choose-another-time"}
            className={styles.card_today}
          >
            {!isImageLoaded && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.9375rem",
                  background: "#0000",
                }}
              />
            )}
            <img
              className={styles.img_today}
              src={FouinImg}
              onLoad={() => setImageLoaded(true)}
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
            <p className={styles.text_today}>На другой срок</p>
            <BiChevronRight className={styles.last_icon}/>
          </Link>
          <a href="#" className={styles.title}>
            {snap.isSearchPark === true ? "Как снять парковку?" : "Как сдать парковку?"}
          </a>
          <div className={styles.wrapper_rent}>
            <h2 className={styles.history}>Мои объявления</h2>
              {myAds.length ? (
                myAds.map((ad) => (
                  <div key={ad.id} className={styles.wrapper_rentCard}>
                    <p className={styles.rent_location}>{ad.park.address}</p>
                    <div className={styles.secondRow}>
                      <span className={styles.rent_time}>{renderDate(ad.park)}</span>
                      <span className={styles.rent_time}>{renderTime(ad.park)}</span>
                      <span className={styles.rent_status}>{ad.park.priceHour} руб/ч</span>
                    </div>
                    <p className={styles.rent_location}>Средний рейтинг: {renderRating(ad.review)}</p>
                  </div>
                ))
              ) : (
                <ZeroData>Объявлений нет</ZeroData>
              )}
            </div>
        </div>
      </Container>
    </>
  );
};

export default SearchTime;
