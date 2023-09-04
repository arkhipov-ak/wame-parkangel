import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import styles from "./ChooseMap.module.css"
import navigation from "../../assets/navigation.svg";
import axios from "axios";

const ChooseMap = () => {
  const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleMapClick = async (e) => {
    setSelectedLocation(e.get("coords"));
    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${e
          .get("coords")
          .join(",")}&format=json`
      );

      const address =
        response.data.response.GeoObjectCollection.featureMember[0].GeoObject
          .metaDataProperty.GeocoderMetaData.text;

      setSelectedAddress(address);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  useEffect(() => {
    if (selectedLocation) {
      console.log(selectedLocation);
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify(selectedLocation)
      );
    }
  }, [selectedLocation]);

  const navigate = useNavigate();

  const handleSelectClick = () => {
    if (selectedAddress) {
      navigate(`/review?address=${encodeURIComponent(selectedAddress)}`);
    }
  };

  return (
    <div>
      <div className={styles.mapContainer}>
        <NavBar />

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
              center: selectedLocation || [55.7558, 37.6173], // Используем выбранные координаты или координаты Москвы по умолчанию
              zoom: 16,
              type: "yandex#map",
            }}
            options={{
              suppressMapOpenBlock: true,
              suppressYandexSearch: true,
            }}
            onClick={handleMapClick} // Обработчик клика по карте
          >
            {selectedLocation && <Placemark geometry={selectedLocation} />}
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default ChooseMap;
