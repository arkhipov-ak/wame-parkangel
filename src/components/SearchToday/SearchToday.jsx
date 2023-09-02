import React, { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar/NavBar";
import styles from "./SearchToday.module.css";
import { Link, useNavigate } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import { useDataContext } from "../../DataContext";

const SearchToday = ({ day }) => {
  const [hoursCount, setHoursCount] = useState(1); // начальное значение часов
  const [activeButton, setActiveButton] = React.useState(null);
  const [activeMapButton, setActiveMapButton] = React.useState(null);
  const [activeButtonLocation, setActiveButtonLocation] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const { setSelectedData } = useDataContext();

  const [tempHour, setTempHour] = useState("00");
  const [tempMinute, setTempMinute] = useState("00");
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const [activeMapButtonLocation, setActiveMapButtonLocation] =
    React.useState(null);

  const navigate = useNavigate();
  const handleRedirect = () => {
    const selectedData = {
      selectedHour,
      selectedMinute,
      hoursCount,
    };
    console.log("Selected Data before redirect:", selectedData);
    navigate("/SelectAdressLocation");
  };
  
  const handleRedirectToOption = () => {
    navigate("/rating");
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
            <p className={styles.give_today}>Найти на {day}</p>
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

            <p>На сколько часов</p>
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
              <p></p>
              <Link
                to={"/rating"}
                className={`${styles.btn_style} ${
                  activeButton === "moscow" ? styles.active : ""
                }`}
                onClick={() => {
                  handleButtonClick("moscow");
                  handleRedirectToOption;
                }}
              >
                Доп. параметры <BiChevronRight className={styles.last_icon} />
              </Link>
            </div>
            <button onClick={handleRedirect} className={styles.search_btn}>
              Быстрая парковка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchToday;
