import React from "react";
import NavBar from "../NavBar";
import styles from "./ResultSearch.module.css";
import Location from "../../assets/location.svg";
import { Link } from "react-router-dom";
import { useDataContext } from "../../DataContext";
const ResultSearch = () => {
  const { selectedData } = useDataContext();
  console.log("Selected Data in ResultSearch:", selectedData);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <p className={styles.main_text}>Результаты поиска</p>
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
          <div>
            {selectedData && (
              <div className={styles.wrapper_rentCard}>
                <p className={styles.rent_location}>
                  {selectedData.activeButtonLocation}
                </p>
                <div className={styles.secondRow}>
                  <p className={styles.rent_date}>
                    <img src={Location} /> {selectedData.distance} м
                  </p>
                  <p className={styles.rent_time}>
                    {selectedData.selectedHour}:{selectedData.selectedMinute} -{" "}
                  </p>
                  <p className={styles.rent_status}>
                    {selectedData.price} руб/ч
                  </p>
                </div>
              </div>
            )}
          </div>
          <Link to="/ShowMapResult" className={styles.submit}>
            Посмотреть все на карте
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultSearch;
