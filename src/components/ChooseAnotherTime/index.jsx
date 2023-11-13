import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { useDebounce } from "use-debounce";

import styles from "./ChooseAnotherTime.module.css";
import NavBar from "src/components/NavBar";
import Container from "src/components/common/Container";
import { state } from "src/state";
import Button from "src/components/common/Button";
import ModalTime from "src/components/common/ModalTime";
import { showErrorSnackbar } from "src/utils/showSnackBar";
import RegionSelect from "src/components/common/RegionSelect";
import { hideKeyboard } from "src/utils/functions";

const ChooseAnotherTime = () => {
	const snap = useSnapshot(state);
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
	const [activeRegion, setActiveRegion] = useState("moscow");
  const [coords, setCoords] = useState(null);
	const [address, setAddress] = useState("");
  const [debounceAddressValue] = useDebounce(address, 1000);
  const [selectedDateStart, setSelectedDateStart] = useState("");
  const [selectedDateEnd, setSelectedDateEnd] = useState("");
  const [selectedHourStart, setSelectedHourStart] = useState("00");
  const [selectedMinuteStart, setSelectedMinuteStart] = useState("00");
  const [selectedHourEnd, setSelectedHourEnd] = useState("00");
  const [selectedMinuteEnd, setSelectedMinuteEnd] = useState("00");
  const dateRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];
	const navigate = useNavigate();

  const onHandleRedirect = (link) => {
    if (link === "/extra-options") {
      if (!address.trim()) {
        showErrorSnackbar({ message: "Не указан адрес", tryAgain: true });
        return;
      }

      if (!coords) {
        showErrorSnackbar({ message: "Не удалось получить координаты парковки", tryAgain: true });
        return;
      }
    } //делаем валидацию адреса и координат только по клику на кнопку "Далее"

    if (!selectedDateStart || !selectedDateEnd) {
      showErrorSnackbar({ message: "Не указана дата", tryAgain: true })
      return;
    }

    if (!activeRegion) {
      showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
      return;
    }

    const dateStart = new Date(selectedDateStart);
    dateStart.setHours(selectedHourStart);
    dateStart.setMinutes(selectedMinuteStart);

    const dateEnd = new Date(selectedDateEnd);
    dateEnd.setHours(selectedHourEnd);
    dateEnd.setMinutes(selectedMinuteEnd);

    state.parkDate = {
      dateStartISO: dateStart.toISOString(),
      dateEndISO: dateEnd.toISOString(),
      hoursStart: selectedHourStart === "00" ? "00" : +selectedHourStart,
      minutesStart: selectedMinuteStart,
      hoursEnd: selectedHourEnd === "00" ? "00" : +selectedHourEnd,
      minutesEnd: selectedMinuteEnd,
      dateStart : selectedDateStart,
      dateEnd: selectedDateEnd,
      region: activeRegion,
      address: address,
      coordinates: coords ? coords.join(", ") : null,
    };

    navigate(link);
  };

  useEffect(() => {
    if (debounceAddressValue && debounceAddressValue.length > 4) {
      const ymaps = window.ymaps;

      // Поиск координат
      ymaps.geocode(debounceAddressValue, { results: 1 }).then((response) => {
        const firstGeoObject = response.geoObjects.get(0);
        const cords = firstGeoObject.geometry.getCoordinates();
      
        setCoords([cords[0], cords[1]]);
      }).catch(() => showErrorSnackbar({ message: "Не удалось получить координаты" }))
    } else {
      setCoords(null);
    }
  }, [debounceAddressValue]);

  console.log(coords);

  useEffect(() => {
    if (snap && snap.user && snap.parkDate) {
      setSelectedHourStart(snap.parkDate.hoursStart || "00");
      setSelectedMinuteStart(snap.parkDate.minutesStart || "00");
      setSelectedHourEnd(snap.parkDate.hoursEnd || "00");
      setSelectedMinuteEnd(snap.parkDate.minutesEnd || "00");
      setSelectedDateStart(snap.parkDate.dateStart || "");
      setSelectedDateEnd(snap.parkDate.dateEnd || "");
      setActiveRegion(snap.parkDate.region || null);
      setAddress(snap.parkDate.address || "");
    }
  }, [snap.user, snap.parkDate]);

  return (
		<>
			<NavBar/>
			<Container>
				<h2 className={styles.title}>Сдать на другой срок</h2>
        <div style={{ width: "100%" }}>
          <span className={styles.label}>Дата и время начала</span>
          <div className={styles.date_time_container}>
            <div className={styles.wrapper_input}>
              <input
                ref={dateRef}
                type="date"
                min={currentDate}
                value={selectedDateStart}
                onChange={(e) => setSelectedDateStart(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div onClick={() => setOpenStartTimeModal(true)} className={styles.time_present}>
              {selectedHourStart}:{selectedMinuteStart}
            </div>
          </div>
          <span className={styles.label}>Дата и время окончания</span>
          <div className={styles.date_time_container}>
            <div className={styles.wrapper_input}>
              <input
                ref={dateRef}
                type="date"
                min={currentDate}
                value={selectedDateEnd}
                onChange={(e) => setSelectedDateEnd(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div onClick={() => setOpenEndTimeModal(true)} className={styles.time_present}>
              {selectedHourEnd}:{selectedMinuteEnd}
            </div>
          </div>
          <div className={styles.block_wrapper}>
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
            <button
              type="button"
              className={styles.btn_style}
              onClick={() => onHandleRedirect("/map")}
              style={{ marginBottom: "15%" }}
            >
              Указать на карте
            </button>
          </div>
          <Button onClick={() => onHandleRedirect("/extra-options")}>
            Далее
          </Button>
        </div>
        <ModalTime
          setOpenTimeModal={setOpenStartTimeModal}
          openTimeModal={openStartTimeModal}
          setSelectedMinute={setSelectedMinuteStart}
          setSelectedHour={setSelectedHourStart}
          isToday={false}
        />
        <ModalTime
          setOpenTimeModal={setOpenEndTimeModal}
          openTimeModal={openEndTimeModal}
          setSelectedMinute={setSelectedMinuteEnd}
          setSelectedHour={setSelectedHourEnd}
          isToday={false}
        />
			</Container>
		</>
	)
};

export default ChooseAnotherTime;
