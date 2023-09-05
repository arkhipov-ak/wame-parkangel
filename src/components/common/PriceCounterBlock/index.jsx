import styles from "./PriceCounterBlock.module.css";

const PriceCounterBlock = ({ price, setPrice }) => {
  const increment = () => {
    setPrice(price + 10);
  };

  const decrement = () => {
    if (price > 0) {
      setPrice(price - 10);
    }
  };

  return (
    <div className={styles.incrementWrapper}>
      <span onClick={decrement} className={styles.incrementWithBorderMinus}>-</span>
      <span className={styles.price}>
        {price}
      </span>
      <span onClick={increment} className={styles.incrementWithBorderPlus}>+</span>
    </div>
  );
};

export default PriceCounterBlock;
