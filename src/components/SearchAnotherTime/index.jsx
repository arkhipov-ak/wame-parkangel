import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
import ModalTime from 'src/components/common/ModalTime'
import ParametersButton from 'src/components/common/ParametersButton'

import NavBar from 'src/components/NavBar'
import { state } from 'src/state'
import { showErrorSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'
import styles from './SearchAnotherTime.module.css'

const SearchAnotherTime = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
  const [selectedDateStart, setSelectedDateStart] = useState("");
  const [selectedDateEnd, setSelectedDateEnd] = useState("");
  const [selectedHourStart, setSelectedHourStart] = useState("00");
  const [selectedMinuteStart, setSelectedMinuteStart] = useState("00");
  const [selectedHourEnd, setSelectedHourEnd] = useState("00");
  const [selectedMinuteEnd, setSelectedMinuteEnd] = useState("00");
  const dateRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];

  const onHandleRedirect = (link) => {
    if (!selectedDateStart || !selectedDateEnd) {
      showErrorSnackbar({ message: "Не указана дата", tryAgain: true })
      return;
    }

    const dateStart = new Date(selectedDateStart);
    dateStart.setHours(selectedHourStart);
    dateStart.setMinutes(selectedMinuteStart);

    const dateEnd = new Date(selectedDateEnd);
    dateEnd.setHours(selectedHourEnd);
    dateEnd.setMinutes(selectedMinuteEnd);
    
    if (dateStart >= dateEnd) {
      showErrorSnackbar({ message: "Время начала не может быть больше или равно времени окончания" });
      return;
   }

    state.parkDate = {
      dateStartISO: dateStart.toISOString(),
      dateEndISO: dateEnd.toISOString(),
      hoursStart: selectedHourStart === "00" ? "00" : +selectedHourStart,
      minutesStart: selectedMinuteStart,
      hoursEnd: selectedHourEnd === "00" ? "00" : +selectedHourEnd,
      minutesEnd: selectedMinuteEnd,
      dateStart : selectedDateStart,
      dateEnd: selectedDateEnd,
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
    }
  }, [snap.user, snap.parkDate]);

  return (
    <div>
      <NavBar/>
      <Container>
        <h2 className={styles.title}>Найти на другой срок</h2>
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
          <div>
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
            <ParametersButton onClick={() => onHandleRedirect("/extra-options")}/>
            <Button onClick={() => onHandleRedirect("/select-address-location")}>Далее</Button>
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
        </div>
      </Container>
    </div>
  );
};

export default SearchAnotherTime;
