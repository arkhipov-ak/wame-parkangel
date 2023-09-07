import styles from "./ZeroData.module.css";

const ZeroData = ({ children }) => {
  return (
    <span className={styles.no_data}>{children}</span>
  )
}

export default ZeroData;