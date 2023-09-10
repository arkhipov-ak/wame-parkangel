import styles from "./ChooseAnotherTime.module.css";
import NavBar from "../NavBar";
import Container from "../common/Container";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../common/Button";
import ModalTime from "../common/ModalTime";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useRef } from "react";
import { useEffect } from "react";

const ChooseAnotherTime = () => {
	const snap = useSnapshot(state);
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
	const [activeRegion, setActiveRegion] = useState(null);
	const [address, setAddress] = useState("");
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
      if (!selectedDateStart || !selectedDateEnd) {
        showErrorSnackbar({ message: "Не указана дата", tryAgain: true })
        return;
      }

      if (!activeRegion) {
        showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
        return;
      }
  
      if (!address.trim()) {
        showErrorSnackbar({ message: "Не указан адрес", tryAgain: true });
        return;
      }
    } //делаем валидацию только по клику на кнопку "Далее"

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
    };

    navigate(link);
  };

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
          <span className={styles.data_time_text}>Дата и время начала</span>
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
          <span className={styles.data_time_text}>Дата и время окончания</span>
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
            <span className={styles.data_time_text}>Ваш регион</span>
            <button
              className={`${styles.btn_style} ${activeRegion === "moscow" ? styles.active : ""}`}
              onClick={() => setActiveRegion("moscow")}
            >
              Москва и область
            </button>
            <button
              className={`${styles.btn_style} ${activeRegion === "spb" ? styles.active : ""}`}
              onClick={() => setActiveRegion("spb")}
            >
              СПб и область
            </button>
            <span className={styles.data_time_text}>Адрес</span>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              className={styles.input_style}
              placeholder="Введите адрес"
              type="text"
            />
            <button className={styles.btn_style} onClick={() => onHandleRedirect("/map")}>
              Указать на карте
            </button>
          </div>
          <Button onClick={() => onHandleRedirect("/extra-options")}>
            Далее
          </Button>
        </div>
				{openStartTimeModal && (
          <ModalTime
            setOpenTimeModal={setOpenStartTimeModal}
            openTimeModal={openStartTimeModal}
            setSelectedMinute={setSelectedMinuteStart}
            setSelectedHour={setSelectedHourStart}
          />
        )}
        {openEndTimeModal && (
          <ModalTime
            setOpenTimeModal={setOpenEndTimeModal}
            openTimeModal={openEndTimeModal}
            setSelectedMinute={setSelectedMinuteEnd}
            setSelectedHour={setSelectedHourEnd}
          />
        )}
			</Container>
		</>
	)
};

export default ChooseAnotherTime;
