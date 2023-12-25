import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import styles from "./AdminInfo.module.css";
import NavBar from "src/components/NavBar";
import Container from "src/components/common/Container";
import Pagination from "src/components/common/Pagination";
import ZeroData from "src/components/common/ZeroData";
import { showErrorSnackbar, showSuccessSnackbar } from "src/utils/showSnackBar";
import deleteImg from "src/assets/delete.svg";
import { renderMonth, renderDay, renderMinutes } from "src/utils/functions";
import ModalDeleteAd from "src/components/common/ModalDeleteAd";

const AdminInfo = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isUsersListAdmin, setUsersListAdmin] = useState(true);
  const [usersArray, setUsersArray] = useState([]);
  const [adsArray, setAdsArray] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const perPage = 5;

  const renderCity = (city) => {
    switch (city) {
      case "moscow": return "Москва"
      case "spb": return "Санкт-Петербург"
      default: return "-"
    }
  };

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
        axios.get("https://api.parkangel.ru/api/ad" , {
          params: { page, perPage },
        }).then((response) => {
          if (response.data.response) {
            setAdsArray(response.data.response.ads);
            setTotalPages(response.data.response.total);
          }
        }).catch(() => showErrorSnackbar({ message: "Не удалось получить список объявлений" }))
      }).catch(() => {
        showErrorSnackbar({ message: "Не удалось удалить объявление" });
        setOpenDeleteModal(false);
      })
  };

  useEffect(() => {
    if (isUsersListAdmin) {
      setAdsArray([]);
      axios.get("https://api.parkangel.ru/api/users" , {
        params: { page, perPage },
      }).then((response) => {
        if (response.data.response) {
          setUsersArray(response.data.response.users);
          setTotalPages(response.data.response.total);
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось получить список пользователей" }))
    } else {
      setUsersArray([]);
      axios.get("https://api.parkangel.ru/api/ad" , {
        params: { page, perPage },
      }).then((response) => {
        if (response.data.response) {
          setAdsArray(response.data.response.ads);
          setTotalPages(response.data.response.total);
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось получить список объявлений" }))
    }
  }, [isUsersListAdmin, page]);

  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
  }, [location.search]);

  return (
    <>
      <NavBar/>
      <Container>
        <div className={styles.wrapper}>
          <button
            className={isUsersListAdmin ? styles.active_btn : styles.not_active_btn}
            onClick={() => {
              setUsersListAdmin(true);
              navigate("/admin/info");
            }}
          >
            Пользователи
          </button>
          <button
            className={!isUsersListAdmin ? styles.active_btn : styles.not_active_btn}
            onClick={() => {
              setUsersListAdmin(false);
              navigate("/admin/info");
            }}
          >
            Объявления
          </button>
        </div>
        {isUsersListAdmin ? (
          <>
            {usersArray.length ? (
              <>
                <ul className={styles.list}>
                  {usersArray.map((user) => (
                    <li key={user.id} className={styles.list_item}>
                      <div className={styles.info_wrapper}>
                        <span>Имя</span>
                        <span>{user.name || "-"}</span>
                      </div>
                      <div className={styles.info_wrapper}>
                        <span>Telegram</span>
                        <a
                          href={`https://t.me/${user.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                            @{user.telegram}
                        </a>
                      </div>
                      <div className={styles.info_wrapper}>
                        <span>Email</span>
                        {user.email ? (
                          <a
                            href={`mailto:${user.email}`}
                            className={styles.link}
                          >
                            {user.email}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      <div className={styles.info_wrapper}>
                        <span>Город</span>
                        <span>{renderCity(user.city)}</span>
                      </div>
                      <div className={styles.info_wrapper}>
                        <span>Телефон</span>
                        {user.phoneNumber ? (
                          <a
                            href={`tel:${user.phoneNumber}`}
                            className={styles.link}
                          >
                            {user.phoneNumber}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <Pagination total={totalPages} page={page} slug="/admin/info"/>
              </>
            ) : (
              <ZeroData>Пользователей нет</ZeroData>
            )}
          </>
        ) : (
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
                        <p className={styles.rent_location}>Рейтинг: {renderRating(ad.review)}</p>
                        <div className={styles.image_block}>
                          <img src={deleteImg} alt="delete" onClick={() => setOpenDeleteModal(true)}/>
                        </div>
                      </div>
                      {openDeleteModal && (
                        <ModalDeleteAd
                          ad={ad}
                          onHandleDeleteClick={onHandleDeleteClick}
                          openDeleteModal={openDeleteModal}
                          setOpenDeleteModal={setOpenDeleteModal}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <Pagination total={totalPages} page={page} slug="/admin/info"/>
              </>
            ) : (
              <ZeroData>Объявлений нет</ZeroData>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default AdminInfo;