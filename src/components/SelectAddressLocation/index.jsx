import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./SelectAddressLocation.module.css";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../DataContext";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Container from "../common/Container";
import Button from "../common/Button";

const SelectAddressLocation = () => {
  const snap = useSnapshot(state);
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

  console.log(snap);

  return (
    <>
      <NavBar/>
      <Container>
        <span className={styles.label}>Ваш регион</span>
        <button
          className={`${styles.btn_style} ${activeButton === "moscow" ? styles.active : ""}`}
          onClick={() => handleButtonClick("moscow")}
        >
          Москва и область
        </button>
        <button
          className={`${styles.btn_style} ${activeButton === "spb" ? styles.active : ""}`}
          onClick={() => handleButtonClick("spb")}
        >
          СПб и область
        </button>
        <span className={styles.label}>Адрес</span>
        <input
          className={styles.input_style}
          placeholder="Введите адрес"
          type="text"
        />
        <button className={styles.btn_style} onClick={handleRedirectToMap}>
          Указать на карте
        </button>
        <button
          className={`${styles.btn_style} ${activeMapButton === "nearby" ? styles.active : ""}`}
          onClick={() => handleMapButtonClick("nearby")}
        >
          Найти рядом со мной
        </button>
        <Button onClick={handleRedirect}>
          Подобрать парковку
        </Button>
      </Container>
    </>
  );
};

export default SelectAddressLocation;
