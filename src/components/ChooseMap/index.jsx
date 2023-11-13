import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

import styles from "./ChooseMap.module.css"
import NavBar from "src/components/NavBar";
import navigation from "src/assets/navigation.svg";
import navigationDark from "src/assets/navigation-black.svg";
import { API_KEY } from "src/utils/constants";
import { state } from "src/state";
import { showErrorSnackbar } from "src/utils/showSnackBar";

const ChooseMap = () => {
  const snap = useSnapshot(state);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();

  const handleMapClick = async (e) => {
    let coords = e.get("coords").reverse();

    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${coords.join(",")}&format=json`
      );

      const address =
        response.data.response.GeoObjectCollection.featureMember[0].GeoObject
          .metaDataProperty.GeocoderMetaData.text;

      setSelectedAddress(address);
    } catch (error) {
      showErrorSnackbar({ message: "Не удалось получить геоданные" });
    } finally {
      setSelectedLocation(coords.reverse());
    }
  };

  const handleSelectClick = () => {
    if (snap.parkDate === null) {
      showErrorSnackbar({ message: "Не удалось загрузить данные", tryAgain: true });
      navigate("/search-time");
    } else if (selectedAddress) {
      state.parkDate.address = selectedAddress
      navigate(-1);
    }
  };

  return (
    <div>
      <div className={styles.mapContainer}>
        <NavBar/>
        <div className={styles.container}>
          <div className={styles.wrapper_div}>
            {selectedAddress || "Выберите местоположение на карте"}
          </div>
          <div className={styles.end__wrapper}>
            <button className={styles.select_btn} onClick={handleSelectClick}>
              Выбрать
            </button>
            <div className={styles.img_wrapper}>
              <img
                className={styles.img}
                src={snap.user?.theme === "light" ? navigation : navigationDark}
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
              center: snap.parkDate?.region === "spb" ? [59.938784, 30.314997] : [55.755864, 37.617698], //координаты Питера и Москвы
              zoom: 16,
              type: "yandex#map",
            }}
            options={{
              suppressMapOpenBlock: true,
              suppressYandexSearch: true,
            }}
            onClick={handleMapClick}
          >
            {selectedLocation && <Placemark geometry={selectedLocation}/>}
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default ChooseMap;
