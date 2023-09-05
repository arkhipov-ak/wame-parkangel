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

const Options = () => {
  const [data, setData] = useState({
      price: 0,
      height: "",
      width: "",
      length: "",
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
  })

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } }
    setData(newObject)
	}

  const onHandleSaveOptions = (e) => {
    e.preventDefault();
    console.log(data);
  }

  useEffect(() => {
    state.additionalOptions = {
      price: 350,
      height: "",
      width: "",
      length: "",
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
    setData(state.additionalOptions)
}, [])

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
                  <CustomCheckBox checked={data.underground} onClick={e => onHandleChange(e, "underground")}>Подземная</CustomCheckBox>
                  <CustomCheckBox checked={data.open} onClick={e => onHandleChange(e, "open")}>Открытая</CustomCheckBox>
                  <CustomCheckBox checked={data.covered} onClick={e => onHandleChange(e, "covered")}>Крытая</CustomCheckBox>
                  <CustomCheckBox checked={data.garage} onClick={e => onHandleChange(e, "garage")}>Гараж</CustomCheckBox>
                </div>
                <div className={styles.toggle_container}>
                  <span className={styles.main_text}>Доп. опции</span>
                  <label>
                    <SwitchToggle active={data.security} onClick={e => onHandleChange(e, "security")}/>
                    Охрана
                  </label>
                  <label>
                    <SwitchToggle active={data.heating} onClick={e => onHandleChange(e, "heating")}/>
                    Обогрев
                  </label>
                </div>
              </div>
              <div className={styles.electro_wrapper}>
                <span className={styles.main_text}>Для электромобилей</span>
                <CustomCheckBox checked={data.electroVolts} onClick={e => onHandleChange(e, "electroVolts")}>220V</CustomCheckBox>
                <CustomCheckBox checked={data.electro} onClick={e => onHandleChange(e, "electro")}>Электромобиль</CustomCheckBox>
                <CustomCheckBox checked={data.electroVoltsAndCharger} onClick={e => onHandleChange(e, "electroVoltsAndCharger")}>
                  220V и зарядка электромобиля
                </CustomCheckBox>
                <CustomCheckBox checked={data.electroWithoutPower} onClick={e => onHandleChange(e, "electroWithoutPower")}>
                  Без электропитания
                </CustomCheckBox>
                <label>
                  <SwitchToggle active={data.nonStandardSizes} onClick={e => onHandleChange(e, "nonStandardSizes")}/>
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
                <PriceCounterBlock price={data.price} setPrice={e => onHandleChange(e, "price")}/>
              </div>
              <Button type="submit" text="Сохранить параметры"/>
            </form>
          </Container>
        </div>
      ) : <div>Загрузка...</div>}
    </>
  );
};

export default Options;
