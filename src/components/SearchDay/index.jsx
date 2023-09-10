import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./SearchToday.module.css";
import { useNavigate } from "react-router-dom";
import Container from "../common/Container";
import HoursCounterBlock from "../common/HoursCounterBlock";
import Button from "../common/Button";
import ParametersButton from "../common/ParametersButton";
import ModalTime from "../common/ModalTime";
import { state } from "../../state";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useSnapshot } from "valtio";
import { useEffect } from "react";

const SearchDay = ({ day }) => {
  const snap = useSnapshot(state);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [hoursCount, setHoursCount] = useState(1);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const navigate = useNavigate();

  const onHandleRedirect = (link) => {
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
      };
    }

    navigate(link);
  };

  useEffect(() => {
    if (snap && snap.user && snap.parkDate) {
      setSelectedHour(snap.parkDate.hoursStartOneDay || "00");
      setSelectedMinute(snap.parkDate.minutesOneDay  || "00");
      setHoursCount(snap.parkDate.hoursCountOneDay || 1);
    }
  }, [snap.user, snap.parkDate]);

  return (
    <>
      <NavBar/>
      <Container>
        <h2 className={styles.give_today}>Найти на {day}</h2>
        <span className={styles.label}>Время начала</span>
        <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
          {selectedHour}:{selectedMinute}
        </div>
        <span className={styles.label}>На сколько времени</span>
        <HoursCounterBlock hoursCount={hoursCount} setHoursCount={setHoursCount}/>
        <ParametersButton onClick={() => onHandleRedirect("/options")}/>
        <Button onClick={() => onHandleRedirect("/select-address-location")}>Быстрая парковка</Button>
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

export default SearchDay;
