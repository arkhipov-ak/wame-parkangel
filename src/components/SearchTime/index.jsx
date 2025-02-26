import { Rate } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import deleteImg from 'src/assets/delete.svg'
import editImg from 'src/assets/edit.svg'
import anotherImg from 'src/assets/fouin_img.svg'
import todayImg from 'src/assets/today_img.svg'
import tomorrowImg from 'src/assets/tomorrow_image.svg'
import Container from 'src/components/common/Container'
import ModalDeleteAd from 'src/components/common/ModalDeleteAd'
import ModalReviews from 'src/components/common/ModalReviews'
import ModalVideo from 'src/components/common/ModalVideo'
import VideoButton from 'src/components/common/VideoButton'
import ZeroData from 'src/components/common/ZeroData'
import NavBar from 'src/components/NavBar'
import SelectSearchGive from 'src/components/SelectSearchGive'
import { state } from 'src/state'
import { renderDay, renderMinutes, renderMonth } from 'src/utils/functions'
import { showErrorSnackbar, showSuccessSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

import styles from './SearchTime.module.css'

const SearchTime = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [myAds, setMyAds] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteAd, setDeleteAd] = useState(null);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);

  const renderTime = (item) => {
    const dateStart = new Date(item.availabilityDateStart);
    const hoursStart = dateStart.getHours();
    const minutesStart = renderMinutes(dateStart);

    const dateEnd = new Date(item.availabilityDateEnd);
    const hoursEnd = dateEnd.getHours();
    const minutesEnd = renderMinutes(dateEnd);

    return `${hoursStart}:${minutesStart} - ${hoursEnd}:${minutesEnd}`;
  };

  const renderDate = (item) => {
    const dateStart = new Date(item.availabilityDateStart);
    const dayStart = renderDay(dateStart);
    const monthStart = renderMonth(dateStart);
    const yearStart = dateStart.getFullYear();

    const dateEnd = new Date(item.availabilityDateEnd);
    const dayEnd = renderDay(dateEnd);
    const monthEnd = renderMonth(dateEnd);
    const yearEnd = dateEnd.getFullYear();

    if (`${dayStart}.${monthStart}.${yearStart}` === `${dayEnd}.${monthEnd}.${yearEnd}`) return `${dayStart}.${monthStart}.${yearStart}`;

    return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  };

  const renderRating = (item) => {
    const ratings = item.map((elem) => elem.rating);
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2);
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
        setMyAds(myAds.filter((item) => item.id !== ad.id));
      })
      .catch(() => {
        showErrorSnackbar({ message: "Не удалось удалить объявление" });
        setOpenDeleteModal(false);
      })
  };

  const onHandleEditClick = (ad) => {
    const dateStart = new Date(ad.park.availabilityDateStart);
    const yearStart = dateStart.getFullYear();
    const monthStart = renderMonth(dateStart);
    const dayStart = renderDay(dateStart);
    const hoursStart = dateStart.getHours();
    const minutesStart = renderMinutes(dateStart);

    const dateEnd = new Date(ad.park.availabilityDateEnd);
    const yearEnd = dateEnd.getFullYear();
    const monthEnd = renderMonth(dateEnd);
    const dayEnd= renderDay(dateEnd);
    const hoursEnd = dateEnd.getHours();
    const minutesEnd = renderMinutes(dateEnd);

    state.isSearchPark = false;
    state.isEditPark = true;
    state.parkDate = {
      park_id: ad.park_id,
      ad_id: ad.id,
      review: ad.review,
      tenant: ad.tenant,
      isRenewable: ad.isRenewable,
      dateStart: `${yearStart}-${monthStart}-${dayStart}`,
      dateEnd: `${yearEnd}-${monthEnd}-${dayEnd}`,
      hoursStart,
      minutesStart,
      hoursEnd,
      minutesEnd,
      region: ad.park.region,
      address: ad.park.address,
      coordinates: ad.park.coordinates,
      comment: ad.comment,
    };
    state.options[0] = {
      priceHour: ad.park.priceHour,
      priceDay: ad.park.priceDay,
      priceWeek: ad.park.priceWeek,
      priceMonth: ad.park.priceMonth,
      height: ad.park.height || "",
      width: ad.park.width || "",
      length: ad.park.length || "",
      isUnderground: ad.park.isUnderground,
      isOutDoor: ad.park.isOutDoor,
      isCovered: ad.park.isCovered,
      isGarage: ad.park.isGarage,
      isProtected: ad.park.isProtected,
      isHeated: ad.park.isHeated,
      isVolts: ad.park.isVolts,
      isSpecializedCharger: ad.park.isSpecializedCharger,
    };

    navigate("/choose-another-time");
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
    state.isEditPark = false;
    state.parkDate = null;
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
          <VideoButton onClick={() => setOpenVideoModal(true)}>
            {snap.isSearchPark === true ? "Как снять парковку?" : "Как сдать парковку?"}
          </VideoButton>
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
                      {!!ad.review.length && (
                         <>
                            <Rate
                              allowHalf
                              disabled
                              value={renderRating(ad.review)}
                              style={{ fontSize: "30px" }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setReviews(ad.review);
                                setOpenReviewsModal(true);
                              }}
                              className={styles.reviews_button}
                            >
                              <span className={styles.reviews_button_text}>Посмотреть отзывы</span>
                            </button>
                         </>
                      )}
                      {!!ad.comment && (
                        <p className={styles.rent_location}>{ad.comment}</p>
                      )}
                      <div className={styles.image_block}>
                        <img src={editImg} alt="edit" onClick={() => onHandleEditClick(ad)}/>
                        <img
                          src={deleteImg}
                          alt="delete"
                          onClick={() => {
                            setDeleteAd(ad);
                            setOpenDeleteModal(true);
                          }}
                        />
                      </div>
                    </div>
                  </Fragment>
                ))
              ) : (
                <ZeroData>Объявлений нет</ZeroData>
              )}
            </div>
            {openDeleteModal && (
              <ModalDeleteAd
                ad={deleteAd}
                onHandleDeleteClick={onHandleDeleteClick}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
              />
            )}
            {openReviewsModal && (
              <ModalReviews
                reviews={reviews}
                totalRating={renderRating(reviews)}
                openReviewsModal={openReviewsModal}
                setOpenReviewsModal={setOpenReviewsModal}
              />
            )}
            {openVideoModal && (
              <ModalVideo
                title={snap.isSearchPark === true ? "Как снять парковку?" : "Как сдать парковку?"}
                videoUrl={snap.isSearchPark === true ? "videos/rent.mp4" : "videos/rent-off.mp4"}
                openVideoModal={openVideoModal}
                setOpenVideoModal={setOpenVideoModal}
              />
            )}
        </div>
      </Container>
    </>
  );
};

export default SearchTime;
