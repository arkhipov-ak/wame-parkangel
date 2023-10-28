import { useEffect, useRef } from "react";
import Modal from "../Modal";
import styles from "./ModalTime.module.css";
import { useState } from "react";

const ModalTime = ({ setOpenTimeModal, openTimeModal, setSelectedMinute, setSelectedHour, isToday }) => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const currentDate = new Date();
  const currentHour = isToday ? currentDate.getHours() : 0;
  const currentMinute = isToday ? currentDate.getMinutes() : 0;
  const hoursArray = Array.from({ length: 24 }, (_, i) => i < 10 ? `0${i}` : `${i}`);
  const [tempHour, setTempHour] = useState(isToday ? currentDate.getHours() : "00");
  const [tempMinute, setTempMinute] = useState("00");

  // Отфильтрованный массив часов на основе текущего времени
  const filteredHoursArray = hoursArray.filter((hour) => parseInt(hour, 10) >= currentHour);

  // Отфильтрованный массив минут на основе текущего времени и выбранного часа
  const getFilteredMinutesArray = (selectedHour) => {
    if (parseInt(selectedHour, 10) === currentHour) {
      return ["00", "15", "30", "45"].filter((minute) => parseInt(minute, 10) >= currentMinute);
    }
    return ["00", "15", "30", "45"];
  };

  useEffect(() => {
    if (openTimeModal) {
      const hourElement = hourRef.current.querySelector(`.${styles.selected}`);
      if (hourElement) hourElement.scrollIntoView({ behavior: "smooth", block: "center" });

      const minuteElement = minuteRef.current.querySelector(`.${styles.selected}`);

      if (minuteElement)
        minuteElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [openTimeModal, tempHour, tempMinute]);

  return (
    <Modal setOpenModal={setOpenTimeModal} openModal={openTimeModal}>
      <>
        <div className={styles.timeSelector}>
          <div className={styles.hour} ref={hourRef}>
            {filteredHoursArray.map((hour, index) => (
              <div
                key={index}
                onClick={() => {
                  setTempHour(hour);
                  setTempMinute("00"); // Сбросьте минуты при смене часа
                }}
                className={`${styles.time} ${tempHour === hour && styles.selected}`}
              >
                {hour}
              </div>
            ))}
          </div>
          <div className={styles.minute} ref={minuteRef}>
            {getFilteredMinutesArray(tempHour).map(
              (minute, index) => (
                <div
                  key={index}
                  onClick={() => setTempMinute(minute)}
                  className={`${styles.time} ${tempMinute === minute && styles.selected}`}
                >
                  {minute}
                </div>
              )
            )}
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <button
            className={styles.modal_button}
            onClick={() => setOpenTimeModal(false)}
          >
            Отмена
          </button>
          <button
            onClick={() => {
              setSelectedHour(tempHour);
              setSelectedMinute(tempMinute);
              setOpenTimeModal(false);
            }}
            className={styles.modal_button}
          >
            Готово
          </button>
        </div>
      </>
    </Modal>
  );
};

export default ModalTime;