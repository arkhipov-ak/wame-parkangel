import { useState, useRef } from "react";
import NavBar from "../NavBar";
import styles from "./SearchAnotherTime.module.css";
import { useNavigate } from "react-router-dom";
import ParametersButton from "../common/ParametersButton";
import Container from "../common/Container";
import Button from "../common/Button";
import ModalTime from "../common/ModalTime";

const SearchAnotherTime = () => {
  const navigate = useNavigate();
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHourStart, setSelectedHourStart] = useState("00");
  const [selectedMinuteStart, setSelectedMinuteStart] = useState("00");
  const [selectedHourEnd, setSelectedHourEnd] = useState("00");
  const [selectedMinuteEnd, setSelectedMinuteEnd] = useState("00");

  const handleRedirectToSelect = () => {
    navigate("/SelectAdressLocation");
  };

  const dateRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];

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
            <div onClick={() => setOpenStartTimeModal(true)} className={styles.time_present}>
              {selectedHourStart}:{selectedMinuteStart}
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
                  onClick={() => setOpenEndTimeModal(true)}
                  className={styles.time_present}
                >
                  {selectedHourEnd}:{selectedMinuteEnd}
                </div>
              </div>
              <ParametersButton link="/extra-options"/>
              <Button onClick={handleRedirectToSelect} text="Быстрая парковка"/>
            </div>
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
        </div>
      </Container>
    </div>
  );
};

export default SearchAnotherTime;
