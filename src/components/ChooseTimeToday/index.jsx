import React, { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar";
import styles from "./ChooseTimeToday.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChooseTimeToday = ({ day }) => {
  const [showModal, setShowModal] = useState(false);
  const [tempHour, setTempHour] = useState("00");
  const [tempMinute, setTempMinute] = useState("00");
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const [hoursCount, setHoursCount] = useState(3); // начальное значение часов
  const [activeButton, setActiveButton] = React.useState(null);
  const [activeMapButton, setActiveMapButton] = React.useState(null);
  const [activeButtonLocation, setActiveButtonLocation] = React.useState(null);

  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const dateRef = useRef(null);
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

  const [activeMapButtonLocation, setActiveMapButtonLocation] =
    React.useState(null);

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/extra-options");
    };
  const handleRedirectToMap = () => {
    navigate("/ChooseAnotherTime");
  };

  const handleButtonLocationClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleMapButtonLocationClick = (buttonId) => {
    setActiveMapButton(buttonId);
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleMapButtonClick = (buttonId) => {
    setActiveMapButton(buttonId);
    navigate("/ChooseAnotherTime");
  };
  const increment = () => {
    if (hoursCount < 24) {
      // Добавляем проверку, чтобы значение не превышало 24
      setHoursCount((prevHours) => prevHours + 1);
    }
  };

  const decrement = () => {
    if (hoursCount > 1) {
      // Добавляем проверку, чтобы значение не уходило ниже 1
      setHoursCount((prevHours) => prevHours - 1);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "00")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "00")
  );
  const handleScroll = (e, setType) => {
    const element = e.target;
    setTimeout(() => {
      const index = Math.round(element.scrollTop / 20); // 20px - высота каждого элемента времени
      if (setType === "hour") {
        setTempHour(hours[index]);
        element.scrollTop = index * 20;
      } else if (setType === "minute") {
        setTempMinute(minutes[index]);
        element.scrollTop = index * 20;
      }
    }, 150); // задержка, чтобы дать время прокрутке дойти до конца
  };

  useEffect(() => {
    if (showModal) {
      hourRef.current.scrollTop = (parseInt(tempHour) - 1) * 40;
      minuteRef.current.scrollTop = (parseInt(tempMinute) - 1) * 40;
    }
  }, [showModal, tempHour, tempMinute]);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

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
          <div>
            <p className={styles.give_today}>Сдать на {day}</p>
            <p
              style={{
                fontSize: "18px",
              }}
            >
              Время начала
            </p>
            <div onClick={openModal} className={styles.time_present}>
              {selectedHour}:{selectedMinute}
            </div>

            <p>На сколько времени</p>
            <div className={styles.incrementWrapper}>
              <p
                onClick={decrement}
                className={styles.incrementWithBorderMinus}
              >
                {" "}
                -{" "}
              </p>
              <p>{hoursCount} часов</p>
              <p className={styles.incrementWithBorderPlus} onClick={increment}>
                {" "}
                +{" "}
              </p>
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
          <div>
            <div>
              <p>Ваш регион</p>
              <button
                className={`${styles.btn_style} ${
                  activeButton === "moscow" ? styles.active : ""
                }`}
                onClick={() => handleButtonClick("moscow")}
              >
                Москва и область
              </button>
              <button
                className={`${styles.btn_style} ${
                  activeButton === "spb" ? styles.active : ""
                }`}
                onClick={() => handleButtonClick("spb")}
              >
                СПб и область
              </button>
            </div>
            <div>
              <p>Адрес</p>
              <button
                className={`${styles.btn_style} ${
                  activeButton === "mosc" ? styles.active : ""
                }`}
                onClick={() => handleButtonClick("mosc")}
              >
                ул. Московская, 99
              </button>
              <button
                className={`${styles.btn_style} ${
                  activeMapButton === "map" ? styles.active : ""
                }`}
                onClick={() => {
                  handleMapButtonClick("map");
                  handleRedirectToMap;
                }}
              >
                Указать на карте
              </button>
            </div>
            <button onClick={handleRedirect} className={styles.search_btn}>
              Далее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseTimeToday;
