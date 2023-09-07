import styles from "./ZeroData.module.css";

const ZeroData = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.no_data}>{children}</span>
    </div>
  )
}

export default ZeroData;