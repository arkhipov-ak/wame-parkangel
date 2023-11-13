import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { useDebounce } from "use-debounce";

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
  const [addressCoords, setAddressCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [debounceAddressValue] = useDebounce(address, 1000);
  const [activeNearMeButton, setActiveNearMeButton] = useState(false);
  const [myCoords, setMyCoords] = useState(null);
  const navigate = useNavigate();

  const onHandleNearMeClick = () => {
    setActiveNearMeButton(!activeNearMeButton);
    setAddress("");
  }

  const onHandleRedirect = (link) => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
      return;
    }

    if (link === "/result-search") {
      if (!address.trim() && !myCoords) {
        showErrorSnackbar({ message: "Укажите адрес либо свои координаты" });
        return;
      }

      if (address.trim() && !addressCoords) {
        showErrorSnackbar({ message: "Не удалось получить координаты адреса", tryAgain: true });
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
      coordinates: myCoords ? myCoords.join(", ") : addressCoords ? addressCoords.join(", ") : null,
    };

    state.parkDate = { ...snap.parkDate, region: activeRegion }; //записываем регион в стейт, чтобы отобразить его на карте
    
    navigate(link);
  };

  useEffect(() => {
    if (snap.parkDate) setAddress(snap.parkDate.address || "");
  }, [snap.parkDate]);

  useEffect(() => {
    console.log('use effect');
    if (!activeNearMeButton) {
      setMyCoords(null);
      return;
    }

    console.log('after if');
    const watchID = navigator.geolocation.watchPosition(function (position) {
      console.log('in fn');
      setMyCoords([position.coords.latitude, position.coords.longitude]);
    });

    console.log('after fn');

    return () => {
      console.log('in return');
      navigator.geolocation.clearWatch(watchID);
    }
  }, [activeNearMeButton]);

  useEffect(() => {
    if (debounceAddressValue && debounceAddressValue.length > 4) {
      const ymaps = window.ymaps;

      // Поиск координат
      ymaps.geocode(debounceAddressValue, { results: 1 }).then((response) => {
        const firstGeoObject = response.geoObjects.get(0);
        const cords = firstGeoObject.geometry.getCoordinates();
      
        setAddressCoords([cords[0], cords[1]]);
      }).catch(() => showErrorSnackbar({ message: "Не удалось получить координаты адреса" }))
    } else {
      setAddressCoords(null);
    }
  }, [debounceAddressValue]);

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
          disabled={activeNearMeButton}
        />
        <button type="button" className={styles.btn_style} onClick={() => onHandleRedirect("/map")}>
          Указать на карте
        </button>
        <button
          type="button"
          className={`${styles.btn_style} ${activeNearMeButton ? styles.active : ""}`}
          style={{ marginBottom: "15%" }}
          onClick={onHandleNearMeClick}
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
