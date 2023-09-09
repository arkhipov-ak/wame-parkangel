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

const ChooseTimeToday = ({ day }) => {
  const snap = useSnapshot(state);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [activeRegion, setActiveRegion] = useState(null);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [hoursCount, setHoursCount] = useState(1);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/extra-options");
  };
  
  const handleRedirectToMap = () => {
    navigate("/ChooseAnotherTime");
  };

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
          <button className={styles.btn_style} onClick={handleRedirectToMap}>
            Указать на карте
          </button>
        </div>
        <Button onClick={handleRedirect}>
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
