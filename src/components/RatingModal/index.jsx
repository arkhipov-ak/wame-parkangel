import { useState } from "react";
import NavBar from "../NavBar";
import Toggle from "react-styled-toggle";
import styles from "./RatingModal.module.css";
import Container from "../common/Container";
import CustomCheckBox from "../common/CustomCheckbox";
import SwitchToggle from "../common/SwitchToggle";

const RatingModal = () => {
  const [price, setPrice] = useState(350); // начальное значение цены
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [underground, setUnderground] = useState(false);
  const [open, setOpen] = useState(false);
  const [covered, setCovered] = useState(false);
  const [garage, setGarage] = useState(false);
  const [security, setSecurity] = useState(false);
  const [heating, setHeating] = useState(false);
  const [electroUnderground, setElectroUnderground] = useState(false);
  const [electroOpen, setElectroOpen] = useState(false);
  const [electroCovered, setElectroCovered] = useState(false);
  const [electroGarage, setElectroGarage] = useState(false);
  const [nonStandardSizes, setNonStandardSizes] = useState(false);
  
  const increment = () => {
    setPrice((prevHours) => prevHours + 10);
  };

  const decrement = () => {
    if (price > 0) {
      // проверка, чтобы предотвратить отрицательные значения
      setPrice((prevHours) => prevHours - 10);
    }
  };

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
          <CustomCheckBox checked={electroUnderground} onClick={setElectroUnderground}>Подземная</CustomCheckBox>
          <CustomCheckBox checked={electroOpen} onClick={setElectroOpen}>Открытая</CustomCheckBox>
          <CustomCheckBox checked={electroCovered} onClick={setElectroCovered}>Крытая</CustomCheckBox>
          <CustomCheckBox checked={electroGarage} onClick={setElectroGarage}>Гараж</CustomCheckBox>
          <label>
            <SwitchToggle active={nonStandardSizes} onClick={setNonStandardSizes}/>
            Нестандартные размеры авто
          </label>
        </div>
        <div className={styles.sizes_wrapper}>
          <span className={styles.main_text}>Размеры, м</span>
          <div className={styles.parent_container}>
            <div className={styles.size_wrapper}>
              <p className={styles.header_text}>Высота</p>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className={styles.parameter}
                required
              />
            </div>
            <div className={styles.size_wrapper}>
              <p className={styles.header_text}>Ширина</p>
              <input
                type="number"
                value={width}
                onChange={e => setWidth(e.target.value)}
                className={styles.parameter}
                required
              />
            </div>
            <div className={styles.size_wrapper}>
              <p className={styles.header_text}>Длина</p>
              <input
                type="number"
                value={length}
                onChange={e => setLength(e.target.value)}
                className={styles.parameter}
                required
              />
            </div>
          </div>
        </div>
        <div className={styles.cont}>
          <h2 className={styles.title}>Макс. стоимость в час</h2>
          <div className={styles.incrementWrapper}>
            <p onClick={decrement} className={styles.incrementWithBorderMinus}>-</p>
            <p className={styles.price}>{price} руб</p>
            <p className={styles.incrementWithBorderPlus} onClick={increment}>+</p>
          </div>
        </div>
        <button className={styles.submit}>Сохранить параметры</button>
      </Container>
    </div>
  );
};

export default RatingModal;
