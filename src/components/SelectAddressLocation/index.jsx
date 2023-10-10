import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./SelectAddressLocation.module.css";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import Container from "../common/Container";
import Button from "../common/Button";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import RegionSelect from "../common/RegionSelect";
import { useEffect } from "react";

const SelectAddressLocation = () => {
  const snap = useSnapshot(state);
  const [activeRegion, setActiveRegion] = useState("moscow");
  const [address, setAddress] = useState("");
  const [activeNearMeButton, setActiveNearMeButton] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
      return;
    }

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
    }
    
    navigate("/result-search");
  };

  useEffect(() => {
    if (snap.parkDate) setAddress(snap.parkDate.address);
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
          type="text"
        />
        <button type="button" className={styles.btn_style} onClick={() => navigate("/map")}>
          Указать на карте
        </button>
        <button
          type="button"
          className={`${styles.btn_style} ${activeNearMeButton ? styles.active : ""}`}
          style={{ marginBottom: "15%" }}
          onClick={() => setActiveNearMeButton(true)}
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
