import NavBar from "../NavBar";
import styles from "./ResultSearch.module.css";
import Location from "../../assets/location.svg";
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
      delete preparedData.id;
      
      axios.get("http://185.238.2.176:5064/api/ad", {
        params: { ...preparedData }
      }).then(response => setData(response.data.response))
      .catch(() => showErrorSnackbar({ message: "Не удалось получить объявления"}))
    }
  }, [snap.user, snap.options]);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className={styles.main_text}>Результаты поиска</h2>
        {data.length ? (
          <>
            <div className={styles.wrapper_rentCard}>
              <p className={styles.rent_location}>Моховая улица, 15/1с1</p>
              <div className={styles.secondRow}>
                <span className={styles.rent_date}>
                  <img src={Location} /> 37 м
                </span>
                <span className={styles.rent_time}>12:00-16:00</span>
                <span className={styles.rent_status}>450 руб/ч</span>
              </div>
            </div>
            <Link to="/show-map-result" className={styles.submit}>
              Посмотреть все на карте
            </Link>
          </>
        ) : (
            <ZeroData>Подходящие объявления не найдены</ZeroData>
        )}
      </Container>
    </>
  );
};

export default ResultSearch;
