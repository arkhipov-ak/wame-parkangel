import { useState } from "react";
import NavBar from "../NavBar";
import Toggle from "react-styled-toggle";
import styles from "./RatingModal.module.css";
import Container from "../common/Container";
import CustomCheckBox from "../common/CustomCheckbox";

const RatingModal = () => {
  const [price, setPrice] = useState(350); // начальное значение цены
  const [height, setHeight] = useState("");
  const [height1, setHeight1] = useState("");
  const [height2, setHeight2] = useState("");
  const [underground, setUnderground] = useState(false);
  const [open, setOpen] = useState(false);
  const [covered, setCovered] = useState(false);
  const [garage, setGarage] = useState(false);
  
  const increment = () => {
    setPrice((prevHours) => prevHours + 10);
  };

  const decrement = () => {
    if (price > 0) {
      // проверка, чтобы предотвратить отрицательные значения
      setPrice((prevHours) => prevHours - 10);
    }
  };

  const handleHeightChange = (event) => {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^\d,]/g, ""); // Удаляем все символы, кроме цифр и запятых
    setHeight(newValue);
  };
  const handleHeightChange1 = (event) => {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^\d,]/g, ""); // Удаляем все символы, кроме цифр и запятых
    setHeight(newValue);
  };
  const handleHeightChange2 = (event) => {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^\d,]/g, ""); // Удаляем все символы, кроме цифр и запятых
    setHeight(newValue);
  };

  const handleBlur = () => {
    if (height !== "") {
      // Если инпут не пустой, добавляем "м" в конец
      setHeight(height + " м");
    }
  };
  return (
    <div>
      <NavBar/>
      <Container>
        <div className={styles.container}>
          <div className={styles.boxContainer}>
            <span className={styles.main_text}>Тип парковки</span>
            <CustomCheckBox checked={underground} onClick={setUnderground}>
              Подземная
            </CustomCheckBox>
            <CustomCheckBox checked={open} onClick={setOpen}>
              Открытая
            </CustomCheckBox>
            <CustomCheckBox checked={covered} onClick={setCovered}>
              Крытая
            </CustomCheckBox>
            <CustomCheckBox checked={garage} onClick={setGarage}>
              Гараж
            </CustomCheckBox>
          </div>

          <div className={styles.toggleContainer}>
            <span className={styles.main_text}>Доп. опции</span>
            <label>
              <div className={styles.toggleWrapper}>
                <Toggle/>
              </div>
              Охрана
            </label>
            <label>
              <div className={styles.toggleWrapper}>
                <Toggle/>
              </div>
              Обогрев
            </label>
          </div>
        </div>
        <div className={styles.elektro_wrapper}>
          <p className={styles.size_main_text}>Для электромобилей</p>
          <div>
            <label>
              <div className={styles.toggleWrapper}>
                <div className={styles.third_style}>
                  <label>
                    <input type="radio" name="parkingType" value="Подземная" />{" "}
                    Подземная
                  </label>
                  <label>
                    <input type="radio" name="parkingType" value="Открытая" />{" "}
                    Открытая
                  </label>
                  <label>
                    <input type="radio" name="parkingType" value="Крытая" />{" "}
                    Крытая
                  </label>
                  <label>
                    <input type="radio" name="parkingType" value="Гараж" />{" "}
                    Гараж
                  </label>
                </div>
              </div>
            </label>
          </div>
          <label>
            <div className={styles.toggleWrapper}>
              <Toggle/>
            </div>
            Нестандартные размеры авто
          </label>
        </div>
        <div>
          <p className={styles.size_main_text}>Размеры, м</p>
          <div className={styles.parent_container}>
            <div className={styles.size_wrapper}>
              <p className={styles.header_text}>Высота</p>
              <input
                type="text"
                placeholder="2.5"
                value={height}
                onChange={handleHeightChange}
                onBlur={handleBlur} // Обработчик потери фокуса
                className={styles.parametr}
                required
              />
            </div>
            <div className={styles.size_wrapper}>
              <p className={styles.header_text}>Ширина</p>
              <input
                type="text"
                placeholder="1.2"
                value={height1}
                onChange={handleHeightChange2}
                onBlur={handleBlur} // Обработчик потери фокуса
                className={styles.parametr}
                required
              />
            </div>
            <div className={styles.size_wrapper}>
              <p className={styles.header_text}>Длина</p>
              <input
                type="text"
                placeholder="3.5"
                value={height2}
                onChange={handleHeightChange1}
                onBlur={handleBlur} // Обработчик потери фокуса
                className={styles.parametr}
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
