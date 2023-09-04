import { useState, useRef, useEffect } from "react";
import NavBar from "../NavBar";
import styles from "./SearchAnotherTime.module.css";
import { useNavigate } from "react-router-dom";
import ParametersButton from "../common/ParametersButton";
import Container from "../common/Container";
import Button from "../common/Button";
import Modal from "../common/Modal";

const SearchAnotherTime = () => {
  const navigate = useNavigate();
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [tempHour, setTempHour] = useState("00");
  const [tempMinute, setTempMinute] = useState("00");
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  const handleRedirectToSelect = () => {
    navigate("/SelectAdressLocation");
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );

  const dateRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (openTimeModal) {
      const hourElement = hourRef.current.querySelector(`.${styles.selected}`);
      if (hourElement)
        hourElement.scrollIntoView({ behavior: "smooth", block: "center" });

      const minuteElement = minuteRef.current.querySelector(
        `.${styles.selected}`
      );
      if (minuteElement)
        minuteElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [openTimeModal, tempHour, tempMinute]);

  const currentDateTime = new Date();
  const currentHour = currentDateTime.getHours();
  const currentMinute = currentDateTime.getMinutes();

  // Отфильтрованный массив часов на основе текущего времени
  const filteredHoursArray = hoursArray.filter(
    (hour) => parseInt(hour, 10) >= currentHour
  );

  // Отфильтрованный массив минут на основе текущего времени и выбранного часа
  const getFilteredMinutesArray = (selectedHour) => {
    if (parseInt(selectedHour, 10) === currentHour) {
      return ["00", "15", "30", "45"].filter(
        (minute) => parseInt(minute, 10) >= currentMinute
      );
    }
    return ["00", "15", "30", "45"];
  };

  return (
    <div>
      <NavBar/>
      <Container>
        <h2 className={styles.search_text}>Найти на другой срок</h2>
        <div style={{ width: "100%" }}>
          <span className={styles.data_time_text}>Дата и время начала</span>
          <div className={styles.date_time_container}>
            <div className={styles.wrapper_input}>
              <input
                ref={dateRef}
                type="date"
                min={currentDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
              {selectedHour}:{selectedMinute}
            </div>
          </div>
          <div>
            <span className={styles.data_time_text}>Дата и время окончания</span>
            <div>
              <div className={styles.date_time_container}>
                <div className={styles.wrapper_input}>
                  <input
                    ref={dateRef}
                    type="date"
                    min={currentDate}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
                <div
                  onClick={() => setOpenTimeModal(true)}
                  className={styles.time_present}
                >
                  {selectedHour}:{selectedMinute}
                </div>
              </div>
              <ParametersButton link="/extra-options"/>
              <Button onClick={handleRedirectToSelect} text="Быстрая парковка"/>
            </div>
          </div>
          {openTimeModal && (
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
                        className={`${styles.time} ${
                          tempHour === hour && styles.selected
                        }`}
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
                          className={`${styles.time} ${
                            tempMinute === minute && styles.selected
                          }`}
                        >
                          {minute}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className={styles.btnWrapper}>
                  <button
                    className={styles.buttonConfirm}
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
                    className={styles.buttonConfirm}
                  >
                    Готово
                  </button>
                </div>
              </>
            </Modal>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SearchAnotherTime;
