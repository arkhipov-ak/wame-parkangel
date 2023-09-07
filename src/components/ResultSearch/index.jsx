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

const ResultSearch = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) {
      if (!snap.parkDate) {
        showErrorSnackbar({ message: "Не удалось получить дату", tryAgain: true });
        navigate("/search-time");
        return;
      }

      console.log(snap.options[0]);

      const getAds = async () => {
        await axios.post("http://185.238.2.176:5064/api/park", snap.options[0])
          .then(response => console.log(response))
          .catch(() => showErrorSnackbar({ message: "Не удалось получить объявления"}))
      };
  
      getAds();
    }
  }, [snap.user, snap.options]);

  return (
    <>
      <NavBar />
      <Container>
        <span className={styles.main_text}>Результаты поиска</span>
        <div>
          <div className={styles.wrapper_rentCard}>
            <p className={styles.rent_location}>Моховая улица, 15/1с1</p>
            <div className={styles.secondRow}>
              <p className={styles.rent_date}>
                <img src={Location} /> 37 м
              </p>
              <p className={styles.rent_time}>12:00-16:00</p>
              <p className={styles.rent_status}>450 руб/ч</p>
            </div>
          </div>

          <Link to="/show-map-result" className={styles.submit}>
            Посмотреть все на карте
          </Link>
        </div>
      </Container>
    </>
  );
};

export default ResultSearch;
