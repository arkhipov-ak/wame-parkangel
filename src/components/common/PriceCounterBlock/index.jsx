import styles from './PriceCounterBlock.module.css'

const PriceCounterBlock = ({ price, setPrice, currency = false, step = 50 }) => {
  const increment = () => setPrice(price + step);

  const decrement = () => {
    if (price > 0) setPrice(price - step);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setPrice(parseInt(value) || 0);
  };

  return (
    <div className={styles.incrementWrapper}>
      <span onClick={decrement} className={styles.incrementWithBorderMinus}>-</span>
      <input
        type="number"
        value={price}
        onChange={handleInputChange}
        className={`${styles.price} ${styles.input}`}
      />
      {currency && <span className={styles.currency}>руб</span>}
      <span onClick={increment} className={styles.incrementWithBorderPlus}>+</span>
    </div>
  );
};

export default PriceCounterBlock;
