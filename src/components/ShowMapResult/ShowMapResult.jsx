import { YMaps, Map } from "@pbe/react-yandex-maps";
import NavBar from "../NavBar";
import styles from "./ShowMapResult.module.css";
import navigation from "../../assets/navigation.svg";
import Location from '../../assets/location.svg'
import { useNavigate } from "react-router-dom";

const ShowMapResult = () => {
  const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/your-add")
  }

  return (
    <div>
      <div className={styles.mapContainer}>
        <NavBar />
        <div className={styles.container}>
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
          <div className={styles.end__wrapper}>
            <button  className={styles.select_btn} onClick={handleRedirect}>Выбрать</button>
            <div className={styles.img_wrapper}>
              <img
                className={styles.img}
                src={navigation}
                alt="Navigation Icon"
              />
            </div>
          </div>
        </div>

        <YMaps apiKey={API_KEY}>
          <Map
            width="100%"
            height="95vh"
            defaultState={{
              center: [55.7558, 37.6173], // Координаты Москвы
              zoom: 16,
              type: "yandex#map",
            }}
            options={{
              suppressMapOpenBlock: true, // Убирает блок с пользовательским соглашением
              suppressYandexSearch: true,
            }}
          ></Map>
        </YMaps>
      </div>
    </div>
  );
};

export default ShowMapResult;
