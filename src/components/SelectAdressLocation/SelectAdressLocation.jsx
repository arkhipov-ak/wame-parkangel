import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import styles from "./SelectAdressLocation.module.css";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../DataContext";

const SelectAdressLocation = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [activeMapButton, setActiveMapButton] = useState(null);
  const { setSelectedData } = useDataContext();
  const navigate = useNavigate();

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleRedirect = () => {
    const selectedData = {
      activeButton,
      activeMapButton,
    };

    setSelectedData(selectedData);

    console.log("Selected Data before redirect:", selectedData);

    navigate("/resultsearch");
  };

  const handleRedirectToMap = () => {
    navigate("/ChooseMap");
  };

  const handleMapButtonClick = (buttonId) => {
    setActiveMapButton(buttonId);
  };

  return (
    <div className={styles.nk}>
      <NavBar />
      <div className={styles.container}>
        <div>
          <p>Ваш регион</p>
          <button
            className={`${styles.btn_style} ${
              activeButton === "moscow" ? styles.active : ""
            }`}
            onClick={() => handleButtonClick("moscow")}
          >
            Москва и область
          </button>
          <button
            className={`${styles.btn_style} ${
              activeButton === "spb" ? styles.active : ""
            }`}
            onClick={() => handleButtonClick("spb")}
          >
            СПб и область
          </button>
        </div>
        <div>
          <p>Адрес</p>
          <input
            className={styles.input_style}
            placeholder="Введите адрес"
            type="text"
          />
          <button className={styles.btn_style} onClick={handleRedirectToMap}>
            Указать на карте
          </button>
          <button
            className={`${styles.btn_style} ${
              activeMapButton === "nearby" ? styles.active : ""
            }`}
            onClick={() => handleMapButtonClick("nearby")}
          >
            Найти рядом со мной
          </button>
        </div>
        <button onClick={handleRedirect} className={styles.search_btn}>
          Подобрать парковку
        </button>
      </div>
    </div>
  );
};

export default SelectAdressLocation;
