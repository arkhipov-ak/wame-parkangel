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
import { useSnapshot } from "valtio";
import axios from "axios";

const SearchDay = ({ day }) => {
  const snap = useSnapshot(state);
  const [hoursCount, setHoursCount] = useState(1);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const navigate = useNavigate();

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(
        `http://185.238.2.176:5064/api/park/${snap.user.chatId}`
      ).then(response => console.log(response))
      .catch(error => console.log(error))

      state.parkOrder = {
        priceHour: "",
        priceDay: "",
        priceWeek: "",
        priceMonth: "",
        height: 0,
        width: 0,
        length: 0,
        isUnderground: false,
        isOutDoor: false,
        isCovered: false,
        isGarage : false,
        isProtected: false,
        isHeated: false,
        isVolts: false,
        isElectroMobile: false,
        isVoltsWithCharger: false,
        isWithoutPower: false,
        isCustomSize: false,
        availabilityDateStart: "",
        availabilityDateEnd: "",
        availabilityTimeStart: "",
        availabilityTimeEnd: "",
        address: "",
        region: "",
      }

      if (snap.parkOrder?.availabilityTimeStart) {
        setSelectedHour(+new Date(snap.parkOrder.availabilityTimeStart).toLocaleTimeString("en",
          { timeStyle: "short", hour12: false, timeZone: "UTC" }).split(":")[0]
        );
        setSelectedMinute(new Date(snap.parkOrder.availabilityTimeStart).toLocaleTimeString("en",
          { timeStyle: "short", hour12: false, timeZone: "UTC" }).split(":")[1]
        );
        setHoursCount(
          +new Date(snap.parkOrder.availabilityTimeEnd).toLocaleTimeString("en",
            { timeStyle: "short", hour12: false, timeZone: "UTC" }).split(":")[0] -
          +new Date(snap.parkOrder.availabilityTimeStart).toLocaleTimeString("en",
            { timeStyle: "short", hour12: false, timeZone: "UTC" }).split(":")[0]
        );
      }
    }
  }, [snap.user]);

  useEffect(() => {
    switch (day) {
      case "сегодня": {
        state.parkOrderDate = new Date().toISOString();
        break;
      }
      case "завтра": {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1)
        state.parkOrderDate = tomorrow.toISOString();
        break;
      }
    }
  }, [day]);

  return (
    <>
      {snap && snap.parkOrder ? (
        <>
          <NavBar/>
          <Container>
            <h2 className={styles.give_today}>Найти на {day}</h2>
            <span className={styles.label}>Время начала</span>
            <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
              {selectedHour}:{selectedMinute}
            </div>
            <span className={styles.label}>На сколько времени</span>
            <HoursCounterBlock hoursCount={hoursCount} setHoursCount={setHoursCount}/>
            <ParametersButton link="/options"/>
            <Button onClick={() => navigate("/select-address-location")} text="Быстрая парковка"/>
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
      ) : (
        <p>Загрузка...</p>
      )}
    </>
  );
};

export default SearchDay;
