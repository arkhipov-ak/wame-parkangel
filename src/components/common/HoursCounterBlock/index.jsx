import { declOfNum } from "../../../utils/functions";
import styles from "./HoursCounterBlock.module.css";

const HoursCounterBlock = ({ hoursCount, setHoursCount }) => {
  const increment = () => {
    if (hoursCount < 24) {
      // Добавляем проверку, чтобы значение не превышало 24
      setHoursCount((prevHours) => prevHours + 1);
    }
  };

  const decrement = () => {
    if (hoursCount > 1) {
      // Добавляем проверку, чтобы значение не уходило ниже 1
      setHoursCount((prevHours) => prevHours - 1);
    }
  };

  return (
    <div className={styles.incrementWrapper}>
      <span onClick={decrement} className={styles.incrementWithBorderMinus}>-</span>
      <span className={styles.hours}>
      {hoursCount} {declOfNum({number: hoursCount, array: ["час", "часа", "часов"]})}
      </span>
      <span onClick={increment} className={styles.incrementWithBorderPlus}>+</span>
    </div>
  );
};

export default HoursCounterBlock;
