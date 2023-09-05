import { useState } from "react";
import NavBar from "../NavBar";
import styles from "./RatingModal.module.css";
import Container from "../common/Container";
import CustomCheckBox from "../common/CustomCheckbox";
import SwitchToggle from "../common/SwitchToggle";
import SizeInput from "../common/SizeInput";
import PriceCounterBlock from "../common/PriceCounterBlock";
import Button from "../common/Button";

const RatingModal = () => {
  const [price, setPrice] = useState(350);
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [underground, setUnderground] = useState(false);
  const [open, setOpen] = useState(false);
  const [covered, setCovered] = useState(false);
  const [garage, setGarage] = useState(false);
  const [security, setSecurity] = useState(false);
  const [heating, setHeating] = useState(false);
  const [electroVolts, setElectroVolts] = useState(false);
  const [electro, setElectro] = useState(false);
  const [electroVoltsAndCharger, setElectroVoltsAndCharger] = useState(false);
  const [electroWithoutPower, setElectroWithoutPower] = useState(false);
  const [nonStandardSizes, setNonStandardSizes] = useState(false);

  return (
    <div>
      <NavBar/>
      <Container>
        <div className={styles.container}>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Тип парковки</span>
            <CustomCheckBox checked={underground} onClick={setUnderground}>Подземная</CustomCheckBox>
            <CustomCheckBox checked={open} onClick={setOpen}>Открытая</CustomCheckBox>
            <CustomCheckBox checked={covered} onClick={setCovered}>Крытая</CustomCheckBox>
            <CustomCheckBox checked={garage} onClick={setGarage}>Гараж</CustomCheckBox>
          </div>
          <div className={styles.toggle_container}>
            <span className={styles.main_text}>Доп. опции</span>
            <label>
              <SwitchToggle active={security} onClick={setSecurity}/>
              Охрана
            </label>
            <label>
              <SwitchToggle active={heating} onClick={setHeating}/>
              Обогрев
            </label>
          </div>
        </div>
        <div className={styles.electro_wrapper}>
          <span className={styles.main_text}>Для электромобилей</span>
          <CustomCheckBox checked={electroVolts} onClick={setElectroVolts}>220V</CustomCheckBox>
          <CustomCheckBox checked={electro} onClick={setElectro}>Электромобиль</CustomCheckBox>
          <CustomCheckBox checked={electroVoltsAndCharger} onClick={setElectroVoltsAndCharger}>
            220V и зарядка электромобиля
          </CustomCheckBox>
          <CustomCheckBox checked={electroWithoutPower} onClick={setElectroWithoutPower}>
            Без электропитания
          </CustomCheckBox>
          <label>
            <SwitchToggle active={nonStandardSizes} onClick={setNonStandardSizes}/>
            Нестандартные размеры авто
          </label>
        </div>
        <div className={styles.sizes_wrapper}>
          <span className={styles.main_text}>Размеры, м</span>
          <div className={styles.parent_container}>
            <SizeInput value={height} onChange={e => setHeight(e.target.value)} label="Высота"/>
            <SizeInput value={width} onChange={e => setWidth(e.target.value)} label="Длина"/>
            <SizeInput value={length} onChange={e => setLength(e.target.value)} label="Ширина"/>
          </div>
        </div>
        <div className={styles.price_counter_wrapper}>
          <span className={styles.main_text}>Макс. стоимость в час, руб</span>
          <PriceCounterBlock price={price} setPrice={setPrice}/>
        </div>
        <Button onClick={() => {}} text="Сохранить параметры"/>
      </Container>
    </div>
  );
};

export default RatingModal;
