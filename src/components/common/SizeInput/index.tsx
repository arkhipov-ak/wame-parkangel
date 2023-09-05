import styles from "./SizeInput.module.css";

const SizeInput = ({ type = "number", value, onChange, required = false, label }) => {
  return (
    <div className={styles.size_wrapper}>
      <span className={styles.header_text}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={styles.parameter}
        required={required}
      />
    </div>
  )
}

export default SizeInput;