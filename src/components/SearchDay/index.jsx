import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./SearchToday.module.css";
import { useNavigate } from "react-router-dom";
import Container from "../common/Container";
import HoursCounterBlock from "../common/HoursCounterBlock";
import Button from "../common/Button";
import ParametersButton from "../common/ParametersButton";
import ModalTime from "../common/ModalTime";
import { state } from "../../state";
import { showErrorSnackbar } from "../../utils/showSnackBar";

const SearchDay = ({ day }) => {
  const [hoursCount, setHoursCount] = useState(1);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const navigate = useNavigate();

  const onHandleParametersClick = () => {
    if (day === "сегодня") {
      const date = new Date();
      
      let hoursStart = new Date();
      hoursStart.setHours(selectedHour)
      hoursStart.setMinutes(selectedMinute);

      let hoursEndTemp = +selectedHour + +hoursCount;

      if (hoursEndTemp > 23) {
        showErrorSnackbar({ message: 'Время заходит на следующий день, выберите опцию "На другой срок"' });
        return;
      }

      let hoursEnd = new Date();
      hoursEnd.setHours(hoursEndTemp)
      hoursEnd.setMinutes(selectedMinute);

      state.parkOrder = {
        availabilityDateStart: date.toISOString(),
        availabilityDateEnd: date.toISOString(),
        availabilityTimeStart: hoursStart.toISOString(),
        availabilityTimeEnd: hoursEnd.toISOString(),
        priceHour: null,
        priceDay: null,
        priceWeek: null,
        priceMonth: null,
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
        address: "",
        region: "",
      };
    }

    if (day === "завтра") {
      const date = new Date();
      const tomorrow = new Date(date);
      tomorrow.setDate(date.getDate() + 1)

      let hoursStart = new Date();
      const hoursStartTomorrow = new Date(hoursStart);
      hoursStartTomorrow.setDate(date.getDate() + 1)

      hoursStartTomorrow.setHours(selectedHour)
      hoursStartTomorrow.setMinutes(selectedMinute);

      let hoursEndTemp = +selectedHour + +hoursCount;

      if (hoursEndTemp > 23) {
        showErrorSnackbar({ message: 'Время заходит на следующий день, выберите опцию "На другой срок"' });
        return;
      }

      let hoursEnd = new Date();
      let hoursEndTomorrow = new Date(hoursEnd);
      hoursEndTomorrow.setDate(date.getDate() + 1)

      hoursEndTomorrow.setHours(hoursEndTemp)
      hoursEndTomorrow.setMinutes(selectedMinute);

      state.parkOrder = {
        availabilityDateStart: tomorrow.toISOString(),
        availabilityDateEnd: tomorrow.toISOString(),
        availabilityTimeStart: hoursStartTomorrow.toISOString(),
        availabilityTimeEnd: hoursEndTomorrow.toISOString(),
        priceHour: null,
        priceDay: null,
        priceWeek: null,
        priceMonth: null,
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
        address: "",
        region: "",
      };
    }

    navigate("/options");
  }

  return (
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
          <ParametersButton onClick={onHandleParametersClick}/>
          <Button onClick={() => navigate("/select-address-location")}>Быстрая парковка</Button>
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
