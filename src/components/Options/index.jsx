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
import { showErrorSnackbar, showSuccessSnackbar } from "../../utils/showSnackBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Options = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [data, setData] = useState({
    priceHour: null,
    priceDay: null,
    priceWeek: null,
    priceMonth: null,
    height: "",
    width: "",
    length: "",
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
  });

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } };
    setData(newObject);
	};

  const onHandleSaveOptions = (e) => {
    e.preventDefault();

    if (data.height && +data.height <= 0) {
      showErrorSnackbar({ message: "Высота должна быть больше нуля", tryAgain: true });
      return;
    }

    if (data.length && +data.length <= 0) {
      showErrorSnackbar({ message: "Длина должна быть больше нуля", tryAgain: true });
      return;
    }

    if (data.width && +data.width <= 0) {
      showErrorSnackbar({ message: "Ширина должна быть больше нуля", tryAgain: true });
      return;
    }

    if (data.priceHour === 0) {
      showErrorSnackbar({ message: "Стоимость в час должна быть больше нуля", tryAgain: true });
      return;
    }

    const preparedData = {
      ...data,
      length: data.length ? +data.length : "",
      height: data.height ? +data.height : "",
      width: data.width ? +data.width : "",
      user_id: snap.user.id,
    }

    if (!preparedData.height) delete preparedData.height;
    if (!preparedData.width) delete preparedData.width;
    if (!preparedData.length) delete preparedData.length;
    if (!preparedData.priceHour) delete preparedData.priceHour;
    if (!preparedData.priceDay) delete preparedData.priceDay;
    if (!preparedData.priceWeek) delete preparedData.priceWeek;
    if (!preparedData.priceMonth) delete preparedData.priceMonth;

    if (snap.options[0]) {
      axios.put(
        "http://185.238.2.176:5064/api/options", preparedData
      ).then(response => {
        if (response) {
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      })
      .catch(showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    } else {
      axios.post(
        "http://185.238.2.176:5064/api/options", preparedData
      ).then(response => {
        if (response) {
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      })
      .catch(showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    }
  };

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`http://185.238.2.176:5064/api/options/userId/${snap.user.id}`)
        .then(response => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user]);

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) {
      setData(snap.options[0]);
    }
  }, [snap.user, snap.options]);

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
                  <SizeInput value={data.height || ""} onChange={e => onHandleChange(e.target.value, "height")} label="Высота"/>
                  <SizeInput value={data.length || ""} onChange={e => onHandleChange(e.target.value, "length")} label="Длина"/>
                  <SizeInput value={data.width || ""} onChange={e => onHandleChange(e.target.value, "width")} label="Ширина"/>
                </div>
              </div>
              <div className={styles.price_counter_wrapper}>
                <span className={styles.main_text}>Макс. стоимость в час, руб</span>
                <PriceCounterBlock price={+data.priceHour} setPrice={e => onHandleChange(e, "priceHour")}/>
              </div>
              <Button type="submit">Сохранить параметры</Button>
            </form>
          </Container>
        </div>
      ) : <p>Загрузка...</p>}
    </>
  );
};

export default Options;
