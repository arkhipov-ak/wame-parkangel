import { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom'
import Container from 'src/components/common/Container'
import NavBar from 'src/components/NavBar'
import { Button, Rate } from 'antd'
import axios from 'src/api/interceptors'
import deleteImg from 'src/assets/delete.svg'
import ModalDeleteAd from 'src/components/common/ModalDeleteAd'
import ModalReviews from 'src/components/common/ModalReviews'
import { renderDay, renderMinutes, renderMonth } from '../../utils/functions.js'
import { showErrorSnackbar, showSuccessSnackbar } from '../../utils/showSnackBar.js'
import ZeroData from '../common/ZeroData/index.jsx'

import styles from './AdminInfo.module.css'

const AdminInfoUser = () => {
  const query = useParams();
  
  const [adsArray, setAdsArray] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteAd, setDeleteAd] = useState(null);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [reviews, setReviews] = useState(null);
  
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
  
  useEffect(() => {
    if(query.id) {
      getUser()
    }
  }, [query])
  
  const getUser = () => {
    axios.get(`https://api.parkangel.ru/api/users/${query.id}`, {
      params: {
        id: query.id
      }
    })
      .then(({ data }) => {
        setAdsArray(data.response.ad)
      }).catch(() => {
    })
  }
  console.log(adsArray)
  const onHandleDeleteClick = (ad) => {
    axios.delete(`https://api.parkangel.ru/api/ad/${ad.id}`)
      .then(() => {
        showSuccessSnackbar({ message: "Объявление удалено" });
        getUser()
        setOpenDeleteModal(false);
      }).catch(() => {
        showErrorSnackbar({ message: "Не удалось удалить объявление" });
        setOpenDeleteModal(false);
      })
  };


  return (
    <>
      <NavBar/>
      <Container>
        {/*<Button>Заблокировать</Button>*/}
        <>
          {adsArray.length ? (
              <>
                <ul className={styles.list}>
                  {adsArray.map((ad) => (
                    <li key={ad.id}>
                      <div className={styles.wrapper_rentCard}>
                        <p className={styles.rent_location}>{ad.park.address}</p>
                        <div className={styles.secondRow}>
                          <span className={styles.rent_time}>{renderDate(ad.park)}</span>
                          <span className={styles.rent_time}>{renderTime(ad.park)}</span>
                          <span className={styles.rent_status}>{renderPrice(ad.park)}</span>
                        </div>
                        {!!ad.comment && (
                        <p className={styles.rent_location}>{ad.comment}</p>
                      )}
                        <div className={styles.image_block}>
                          <img
                            src={deleteImg}
                            alt="delete"
                            onClick={() => {
                              setDeleteAd(ad);
                              setOpenDeleteModal(true);
                            }}/>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
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
             </>
            ) : (
              <ZeroData>Объявлений нет</ZeroData>
            )}
          </>
      </Container>
    </>
  );
};

export default AdminInfoUser;