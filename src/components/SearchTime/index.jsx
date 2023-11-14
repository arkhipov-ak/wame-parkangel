import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import axios from "axios";
import { useSnapshot } from "valtio";

import styles from "./SearchTime.module.css";
import NavBar from "src/components/NavBar";
import SelectSearchGive from "src/components/SelectSearchGive";
import todayImg from "src/assets/today_img.svg";
import tomorrowImg from "src/assets/tomorrow_image.svg";
import anotherImg from "src/assets/fouin_img.svg";
import deleteImg from "src/assets/delete.svg";
import editImg from "src/assets/edit.svg";
import Container from "src/components/common/Container";
import { showErrorSnackbar, showSuccessSnackbar } from "src/utils/showSnackBar";
import { state } from "src/state";
import ZeroData from "src/components/common/ZeroData";
import Modal from "src/components/common/Modal";

const SearchTime = () => {
  const snap = useSnapshot(state);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
    if (!item.length) return "Недостаточно оценок";
    const ratings = item.map((elem) => elem.rating);
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
  };

  const renderPrice = (item) => {
    if (item.priceHour) return `${item.priceHour} руб/ч`;
    if (item.priceDay) return `${item.priceDay} руб/д`;
    if (item.priceWeek) return `${item.priceWeek} руб/н`;
    if (item.priceYear) return `${item.priceYear} руб/г`;
  };

  const onHandleDeleteClick = (ad) => {
    axios.delete(`https://api.parkangel.ru/api/ad/${ad.id}`)
      .then(() => {
        showSuccessSnackbar({ message: "Объявление удалено" });
        setOpenDeleteModal(false);
        axios.get(`https://api.parkangel.ru/api/ad/userId/${snap.user.id}`)
          .then((response) => setMyAds(response.data.response))
          .catch(() => showErrorSnackbar({ message: "Не удалось получить объявления" }))
      })
      .catch(() => {
        showErrorSnackbar({ message: "Не удалось удалить объявление" });
        setOpenDeleteModal(false);
      })
  };

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`https://api.parkangel.ru/api/ad/userId/${snap.user.id}`)
        .then((response) => setMyAds(response.data.response))
        .catch(() => showErrorSnackbar({ message: "Не удалось получить объявления" }))
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
              src={todayImg}
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
              src={tomorrowImg}
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
              src={anotherImg}
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
                  <Fragment key={ad.id}>
                    <div className={styles.wrapper_rentCard}>
                      <p className={styles.rent_location}>{ad.park.address}</p>
                      <div className={styles.secondRow}>
                        <span className={styles.rent_time}>{renderDate(ad.park)}</span>
                        <span className={styles.rent_time}>{renderTime(ad.park)}</span>
                        <span className={styles.rent_status}>{renderPrice(ad.park)}</span>
                      </div>
                      <p className={styles.rent_location}>Рейтинг: {renderRating(ad.review)}</p>
                      <div className={styles.image_block}>
                        <img src={editImg} alt="edit"/>
                        <img src={deleteImg} alt="delete" onClick={() => setOpenDeleteModal(true)}/>
                      </div>
                    </div>
                    {openDeleteModal && (
                      <Modal
                        setOpenModal={setOpenDeleteModal}
                        openModal={openDeleteModal}
                        title="Удалить объявление?"
                      >
                        <div className={styles.btnWrapper}>
                          <button type="button" className={styles.modal_button} onClick={() => setOpenDeleteModal(false)}>
                            Нет
                          </button>
                          <button type="button" onClick={() => onHandleDeleteClick(ad)} className={styles.modal_button}>
                            Да
                          </button>
                        </div>
                      </Modal>
                    )}
                  </Fragment>
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
