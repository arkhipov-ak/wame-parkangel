import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./SearchToday.module.css";
import { useNavigate } from "react-router-dom";
import Container from "../common/Container";
import HoursCounterBlock from "../common/HoursCounterBlock";
import Button from "../common/Button";
import ParametersButton from "../common/ParametersButton";
import ModalTime from "../common/ModalTime";
import { useEffect } from "react";
import { state } from "../../state";

const SearchDay = ({ day }) => {
  const [hoursCount, setHoursCount] = useState(1);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
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

  useEffect(() => {
    switch (day) {
      case "сегодня":
        state.todayRent = {
          price: 350,
          height: null,
          width: null,
          length: null,
          underground: false,
          open: false,
          covered: false,
          garage: false,
          security: false,
          heating: false,
          electroVolts: false,
          electro: false,
          electroVoltsAndCharger: false,
          electroWithoutPower: false,
          nonStandardSizes: false,
        }
        break;
      case "завтра": 
        state.tomorrowRent = {
          price: 450,
          height: null,
          width: null,
          length: null,
          underground: false,
          open: false,
          covered: false,
          garage: false,
          security: false,
          heating: false,
          electroVolts: false,
          electro: false,
          electroVoltsAndCharger: false,
          electroWithoutPower: false,
          nonStandardSizes: false,
        }
        break;
    }
  }, [day])

  return (
    <>
      <NavBar/>
      <Container>
        <h2 className={styles.give_today}>Найти на {day}</h2>
        <span className={styles.label}>Время начала</span>
        <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
          {selectedHour}:{selectedMinute}
        </div>
        <span className={styles.label}>На сколько часов</span>
        <HoursCounterBlock hoursCount={hoursCount} setHoursCount={setHoursCount}/>
        <ParametersButton link="/options"/>
        <Button onClick={handleRedirect} text="Быстрая парковка"/>
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
