import React from "react";
import { YMaps, Map } from "@pbe/react-yandex-maps";
import NavBar from "../NavBar";

const SelectInMap = () => {
  const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";
  return (
    <div>
      <NavBar/>
      <div>
      <YMaps apiKey={API_KEY}>
        <Map
          width="100%"
          height="100vh"
          defaultState={{
            center: [55.7558, 37.6173], // Координаты Москвы
            zoom: 16,
            type: "yandex#map",
          }}
          options={{
            suppressMapOpenBlock: true, // Убирает блок "Открыть в Яндекс.Картах"
            suppressYandexSearch: true,
          }}
        ></Map>
      </YMaps>
      </div>
    </div>
  );
};

export default SelectInMap;
