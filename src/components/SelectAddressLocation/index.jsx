import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import NavBar from "src/components/NavBar";
import styles from "./SelectAddressLocation.module.css";
import { state } from "src/state";
import Container from "src/components/common/Container";
import Button from "src/components/common/Button";
import { showErrorSnackbar } from "src/utils/showSnackBar";
import RegionSelect from "src/components/common/RegionSelect";
import { hideKeyboard } from "src/utils/functions";

const SelectAddressLocation = () => {
  const snap = useSnapshot(state);
  const [activeRegion, setActiveRegion] = useState("moscow");
  const [address, setAddress] = useState("");
  const [activeNearMeButton, setActiveNearMeButton] = useState(false);
  const navigate = useNavigate();

  const onHandleRedirect = (link) => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
      return;
    }

    if (link === "/result-search") {
      if (!address.trim()) {
        showErrorSnackbar({ message: "Не указан адрес", tryAgain: true });
        return;
      }
    } //делаем валидацию адреса только по клику на кнопку "Подобрать парковку"

    if (!activeRegion) {
      showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
      return;
    }

    state.options[0] = {
      ...snap.options[0],
      address: address,
      region: activeRegion,
      availabilityDateEnd: snap.parkDate.dateEndISO,
      availabilityDateStart: snap.parkDate.dateStartISO,
    };

    state.parkDate = { ...snap.parkDate, region: activeRegion }; //записываем регион в стейт, чтобы отобразить его на карте
    
    navigate(link);
  };

  useEffect(() => {
    if (snap.parkDate) setAddress(snap.parkDate.address || "");
  }, [snap.parkDate]);

  return (
    <>
      <NavBar/>
      <Container>
        <span className={styles.label}>Ваш регион</span>
        <RegionSelect activeRegion={activeRegion} setActiveRegion={setActiveRegion}/>
        <span className={styles.label}>Адрес</span>
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          className={styles.input_style}
          placeholder="Введите адрес"
          onKeyDown={hideKeyboard}
          type="text"
        />
        <button type="button" className={styles.btn_style} onClick={() => onHandleRedirect("/map")}>
          Указать на карте
        </button>
        <button
          type="button"
          className={`${styles.btn_style} ${activeNearMeButton ? styles.active : ""}`}
          style={{ marginBottom: "15%" }}
          onClick={() => setActiveNearMeButton(!activeNearMeButton)}
        >
          Найти рядом со мной
        </button>
        <Button onClick={() => onHandleRedirect("/result-search")}>
          Подобрать парковку
        </Button>
      </Container>
    </>
  );
};

export default SelectAddressLocation;
