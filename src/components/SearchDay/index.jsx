import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import styles from "./SearchToday.module.css";
import NavBar from "src/components/NavBar";
import Container from "src/components/common/Container";
import HoursCounterBlock from "src/components/common/HoursCounterBlock";
import Button from "src/components/common/Button";
import ParametersButton from "src/components/common/ParametersButton";
import ModalTime from "src/components/common/ModalTime";
import { state } from "src/state";
import { showErrorSnackbar } from "src/utils/showSnackBar";

const SearchDay = ({ day }) => {
  const snap = useSnapshot(state);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [hoursCount, setHoursCount] = useState(1);
  const [selectedHours, setSelectedHours] = useState("00");
  const [selectedMinutes, setSelectedMinutes] = useState("00");
  const navigate = useNavigate();

  const onHandleRedirect = (link) => {
    let hoursEndTemp = +selectedHours + +hoursCount;

    if (hoursEndTemp > 23) {
      showErrorSnackbar({ message: 'Время заходит на следующий день, выберите опцию "На другой срок"' });
      return;
    }

    if (day === "сегодня") {
      const dateStart = new Date();

      if ((+selectedHours < dateStart.getHours()) ||
          (+selectedHours === dateStart.getHours() && +selectedMinutes < dateStart.getMinutes())
        ) {
        showErrorSnackbar({ message: "Выбранное время уже прошло", tryAgain: true });
        return;
      }
      
      dateStart.setHours(selectedHours);
      dateStart.setMinutes(selectedMinutes);

      const dateEnd = new Date();
      dateEnd.setHours(hoursEndTemp);
      dateEnd.setMinutes(selectedMinutes);

      state.parkDate = {
        dateStartISO: dateStart.toISOString(),
        dateEndISO: dateEnd.toISOString(),
        hoursStartOneDay: selectedHours === "00" ? "00" : +selectedHours,
        minutesOneDay: selectedMinutes,
        hoursCountOneDay: hoursCount,
      };
    }

    if (day === "завтра") {
      const date = new Date();
      const tomorrowStart = new Date(date);
      tomorrowStart.setDate(date.getDate() + 1);
      tomorrowStart.setHours(selectedHours);
      tomorrowStart.setMinutes(selectedMinutes);

      const tomorrowEnd = new Date(date);
      tomorrowEnd.setDate(date.getDate() + 1);
      tomorrowEnd.setHours(hoursEndTemp);
      tomorrowEnd.setMinutes(selectedMinutes);

      state.parkDate = {
        dateStartISO: tomorrowStart.toISOString(),
        dateEndISO: tomorrowEnd.toISOString(),
        hoursStartOneDay: selectedHours === "00" ? "00" : +selectedHours,
        minutesOneDay: selectedMinutes,
        hoursCountOneDay: hoursCount,
      };
    }

    navigate(link);
  };

useEffect(() => {
  if (day === "сегодня") {
    const now = new Date();
    let nearestHour = now.getHours();
    let nearestMinutes = now.getMinutes();

    if (nearestMinutes > 45) {
      nearestHour += 1;
      nearestMinutes = 0;
    } else {
      nearestMinutes = Math.ceil(nearestMinutes / 15) * 15;
    }

    if (nearestHour > 23) {
      showErrorSnackbar({ message: "Сегодня парковка уже недоступна, выберите другой день" });
      return;
    }

    setSelectedHours(nearestHour < 10 ? `0${nearestHour}` : `${nearestHour}`);
    setSelectedMinutes(nearestMinutes < 10 ? `0${nearestMinutes}` : `${nearestMinutes}`);
  }

  if (snap && snap.user && snap.parkDate) {
    setSelectedHours(snap.parkDate.hoursStartOneDay || "00");
    setSelectedMinutes(snap.parkDate.minutesOneDay  || "00");
    setHoursCount(snap.parkDate.hoursCountOneDay || 1);
  }
}, [snap.user, snap.parkDate, day]);


  return (
    <>
      <NavBar/>
      <Container>
        <h2 className={styles.give_today}>Найти на {day}</h2>
        <span className={styles.label}>Время начала</span>
        <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
          {selectedHours}:{selectedMinutes}
        </div>
        <span className={styles.label}>На сколько времени</span>
        <HoursCounterBlock hoursCount={hoursCount} setHoursCount={setHoursCount}/>
        <ParametersButton onClick={() => onHandleRedirect("/options")}/>
        <Button onClick={() => onHandleRedirect("/select-address-location")}>Далее</Button>
        <ModalTime
          setOpenTimeModal={setOpenTimeModal}
          openTimeModal={openTimeModal}
          setSelectedMinute={setSelectedMinutes}
          setSelectedHour={setSelectedHours}
          isToday={day === "сегодня"}
        />
      </Container>
    </>
  );
};

export default SearchDay;
