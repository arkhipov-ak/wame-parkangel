import { useEffect } from "react";
import NavBar from "../NavBar";
import styles from "./Options.module.css";
import Container from "../common/Container";
import CustomCheckBox from "../common/CustomCheckbox";
import SwitchToggle from "../common/SwitchToggle";
import SizeInput from "../common/SizeInput";
import PriceCounterBlock from "../common/PriceCounterBlock";
import Button from "../common/Button";
import { state } from "../../state";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { showErrorSnackbar } from "../../utils/showErrorSnackBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Options = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [data, setData] = useState({
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
  });

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } };
    setData(newObject);
	};

  const onHandleSaveOptions = (e) => {
    e.preventDefault();

    if (+data.height <= 0) {
      showErrorSnackbar({ message: "Высота должна быть больше нуля", tryAgain: true });
      return;
    }

    if (+data.length <= 0) {
      showErrorSnackbar({ message: "Длина должна быть больше нуля", tryAgain: true })
      return;
    }

    if (+data.width <= 0) {
      showErrorSnackbar({ message: "Ширина должна быть больше нуля", tryAgain: true })
      return;
    }

    if (data.priceHour === 0) {
      showErrorSnackbar({ message: "Стоимость в час должна быть больше нуля", tryAgain: true })
      return;
    }

    const preparedData = {
      ...data,
      length: +data.length,
      height: +data.height,
      width: +data.width,
      availabilityDateStart: snap.parkOrderDate,
      availabilityDateEnd: snap.parkOrderDate,
      user_id: snap.user.chatId,
    }

    if (!preparedData.availabilityDateStart) {
      showErrorSnackbar({ message: "Не удалось получить дату", tryAgain: true });
      navigate("/search-time");
      return;
    }

    console.log(preparedData);

    axios.post(
      "http://185.238.2.176:5064/api/park", preparedData
    ).then(response => console.log('response', response))
    .catch(error => console.log(error))
  };

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

      setData(snap.parkOrder)
    }
  }, [snap.user]);


  return (
    <>
      {data ? (
        <div>
          <NavBar/>
          <Container>
            <form onSubmit={onHandleSaveOptions}>
              <div className={styles.container}>
                <div className={styles.box_container}>
                  <span className={styles.main_text}>Тип парковки</span>
                  <CustomCheckBox checked={data.isUnderground} onClick={e => onHandleChange(e, "isUnderground")}>
                    Подземная
                  </CustomCheckBox>
                  <CustomCheckBox checked={data.isOutDoor} onClick={e => onHandleChange(e, "isOutDoor")}>
                    Открытая
                  </CustomCheckBox>
                  <CustomCheckBox checked={data.isCovered} onClick={e => onHandleChange(e, "isCovered")}>
                    Крытая
                  </CustomCheckBox>
                  <CustomCheckBox checked={data.isGarage} onClick={e => onHandleChange(e, "isGarage")}>
                    Гараж
                  </CustomCheckBox>
                </div>
                <div className={styles.toggle_container}>
                  <span className={styles.main_text}>Доп. опции</span>
                  <label>
                    <SwitchToggle active={data.isProtected} onClick={e => onHandleChange(e, "isProtected")}/>
                    Охрана
                  </label>
                  <label>
                    <SwitchToggle active={data.isHeated} onClick={e => onHandleChange(e, "isHeated")}/>
                    Обогрев
                  </label>
                </div>
              </div>
              <div className={styles.electro_wrapper}>
                <span className={styles.main_text}>Для электромобилей</span>
                <CustomCheckBox checked={data.isVolts} onClick={e => onHandleChange(e, "isVolts")}>
                  220V
                </CustomCheckBox>
                <CustomCheckBox checked={data.isElectroMobile} onClick={e => onHandleChange(e, "isElectroMobile")}>
                  Электромобиль
                </CustomCheckBox>
                <CustomCheckBox checked={data.isVoltsWithCharger} onClick={e => onHandleChange(e, "isVoltsWithCharger")}>
                  220V и зарядка электромобиля
                </CustomCheckBox>
                <CustomCheckBox checked={data.isWithoutPower} onClick={e => onHandleChange(e, "isWithoutPower")}>
                  Без электропитания
                </CustomCheckBox>
                <label>
                  <SwitchToggle active={data.isCustomSize} onClick={e => onHandleChange(e, "isCustomSize")}/>
                  Нестандартные размеры авто
                </label>
              </div>
              <div className={styles.sizes_wrapper}>
                <span className={styles.main_text}>Размеры, м</span>
                <div className={styles.parent_container}>
                  <SizeInput value={data.height} onChange={e => onHandleChange(e.target.value, "height")} label="Высота"/>
                  <SizeInput value={data.width} onChange={e => onHandleChange(e.target.value, "width")} label="Длина"/>
                  <SizeInput value={data.length} onChange={e => onHandleChange(e.target.value, "length")} label="Ширина"/>
                </div>
              </div>
              <div className={styles.price_counter_wrapper}>
                <span className={styles.main_text}>Макс. стоимость в час, руб</span>
                <PriceCounterBlock price={+data.priceHour} setPrice={e => onHandleChange(e, "priceHour")}/>
              </div>
              <Button type="submit" text="Сохранить параметры"/>
            </form>
          </Container>
        </div>
      ) : <p>Загрузка...</p>}
    </>
  );
};

export default Options;
