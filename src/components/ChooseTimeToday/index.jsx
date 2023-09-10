import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./ChooseTimeToday.module.css";
import { useNavigate } from "react-router-dom";
import Container from "../common/Container";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import HoursCounterBlock from "../common/HoursCounterBlock";
import ModalTime from "../common/ModalTime";
import Button from "../common/Button";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useEffect } from "react";

const ChooseTimeToday = ({ day }) => {
  const snap = useSnapshot(state);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [activeRegion, setActiveRegion] = useState(null);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [hoursCount, setHoursCount] = useState(1);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const onHandleRedirect = (link) => {
    if (!activeRegion) {
      showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
      return;
    }

    if (!address.trim()) {
      showErrorSnackbar({ message: "Не указан адрес", tryAgain: true });
      return;
    }

    let hoursEndTemp = +selectedHour + +hoursCount;

    if (hoursEndTemp > 23) {
      showErrorSnackbar({ message: 'Время заходит на следующий день, выберите опцию "На другой срок"' });
      return;
    }

    if (day === "сегодня") {
      const dateStart = new Date();
      dateStart.setHours(selectedHour);
      dateStart.setMinutes(selectedMinute);

      const dateEnd = new Date();
      dateEnd.setHours(hoursEndTemp);
      dateEnd.setMinutes(selectedMinute);

      state.parkDate = {
        dateStartISO: dateStart.toISOString(),
        dateEndISO: dateEnd.toISOString(),
        hoursStartOneDay: selectedHour === "00" ? "00" : +selectedHour,
        minutesOneDay: selectedMinute,
        hoursCountOneDay: hoursCount,
        region: activeRegion,
        address: address,
      };
    }

    if (day === "завтра") {
      const date = new Date();
      const tomorrowStart = new Date(date);
      tomorrowStart.setDate(date.getDate() + 1);
      tomorrowStart.setHours(selectedHour);
      tomorrowStart.setMinutes(selectedMinute);

      const tomorrowEnd = new Date(date);
      tomorrowEnd.setDate(date.getDate() + 1);
      tomorrowEnd.setHours(hoursEndTemp);
      tomorrowEnd.setMinutes(selectedMinute);

      state.parkDate = {
        dateStart: tomorrowStart.toISOString(),
        dateEnd: tomorrowEnd.toISOString(),
        hoursStartOneDay: selectedHour === "00" ? "00" : +selectedHour,
        minutesOneDay: selectedMinute,
        hoursCountOneDay: hoursCount,
        region: activeRegion,
        address: address,
      };
    }

    navigate(link);
  };

  useEffect(() => {
    if (snap && snap.user && snap.parkDate) {
      setSelectedHour(snap.parkDate.hoursStartOneDay || "00");
      setSelectedMinute(snap.parkDate.minutesOneDay  || "00");
      setHoursCount(snap.parkDate.hoursCountOneDay || 1);
      setActiveRegion(snap.parkDate.region || 1);
      setAddress(snap.parkDate.address || 1);
    }
  }, [snap.user, snap.parkDate]);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className={styles.title}>Сдать на {day}</h2>  
        <span className={styles.label}>Время начала</span>
        <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
          {selectedHour}:{selectedMinute}
        </div>
        <span className={styles.label}>На сколько времени</span>
        <HoursCounterBlock hoursCount={hoursCount} setHoursCount={setHoursCount}/>
        <div className={styles.block_wrapper}>
          <span className={styles.label}>Ваш регион</span>
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
          <span className={styles.label}>Адрес</span>
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
        {openTimeModal && (
          <ModalTime
            setOpenTimeModal={setOpenTimeModal}
            openTimeModal={openTimeModal}
            setSelectedMinute={setSelectedMinute}
            setSelectedHour={setSelectedHour}
          />
        )}
      </Container>
    </>
  );
};

export default ChooseTimeToday;
