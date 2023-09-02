import React, { useState, useRef, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import styles from "./SearchAnotherTime.module.css";
import { Link, useNavigate } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";

const SearchAnotherTime = () => {
  const [activeButton, setActiveButton] = React.useState(null);
  const navigate = useNavigate();
  const handleRedirectToOption = () => {
    navigate("/ExtraOptions");
  };
  const handleRedirectToSelect = () => {
    navigate("/SelectAdressLocation");
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [tempHour, setTempHour] = useState("00");
  const [tempMinute, setTempMinute] = useState("00");
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const dateRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (showModal) {
      const hourElement = hourRef.current.querySelector(`.${styles.selected}`);
      if (hourElement)
        hourElement.scrollIntoView({ behavior: "smooth", block: "center" });

      const minuteElement = minuteRef.current.querySelector(
        `.${styles.selected}`
      );
      if (minuteElement)
        minuteElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showModal, tempHour, tempMinute]);

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
      <NavBar />
      <div className={styles.container}>
        <div>
          <p className={styles.search_text}>Найти на другой срок</p>
          <div>
            <p className={styles.data_time_text}>Дата и время начала</p>
            <div>
              <div className={styles.dateTimeContainer}>
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
                <p
                  style={{
                    fontSize: "18px",
                  }}
                ></p>
                <div onClick={openModal} className={styles.time_present}>
                  {selectedHour}:{selectedMinute}
                </div>
              </div>
              <div>
                <p className={styles.data_time_text}>Дата и время окончания</p>
                <div>
                  <div className={styles.dateTimeContainer}>
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
                    <p
                      style={{
                        fontSize: "18px",
                      }}
                    ></p>
                    <div
                      onClick={() => setShowModal(true)}
                      className={styles.time_present}
                    >
                      {selectedHour}:{selectedMinute}
                    </div>
                  </div>
                  <Link
                    to={"/ExtraOptions"}
                    className={`${styles.btn_style} ${
                      activeButton === "moscow" ? styles.active : ""
                    }`}
                    onClick={() => {
                      handleButtonClick("moscow");
                      handleRedirectToOption;
                    }}
                  >
                    Доп. параметры{" "}
                    <BiChevronRight className={styles.last_icon} />
                  </Link>
                  <button
                    onClick={handleRedirectToSelect}
                    className={styles.search_btn}
                  >
                    Быстрая парковка
                  </button>
                </div>
              </div>
              {showModal && (
                <div
                  className={styles.modalOverlay}
                  onClick={() => setShowModal(false)}
                >
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
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
                        onClick={closeModal}
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHour(tempHour);
                          setSelectedMinute(tempMinute);
                          setShowModal(false);
                        }}
                        className={styles.buttonConfirm}
                      >
                        Готово
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnotherTime;
