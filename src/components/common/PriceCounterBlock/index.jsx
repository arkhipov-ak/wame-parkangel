import styles from "./PriceCounterBlock.module.css";

const PriceCounterBlock = ({ price, setPrice, currency = false, step = 50 }) => {
  const increment = () => setPrice(price + step);

  const decrement = () => {
    if (price > 0) setPrice(price - step);
  };

  return (
    <div className={styles.incrementWrapper}>
      <span onClick={decrement} className={styles.incrementWithBorderMinus}>-</span>
      <span className={styles.price}>
        {price} {currency && "руб"}
      </span>
      <span onClick={increment} className={styles.incrementWithBorderPlus}>+</span>
    </div>
  );
};

export default PriceCounterBlock;
