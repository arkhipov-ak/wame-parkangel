import styles from "./SizeInput.module.css";
import { hideKeyboard } from "src/utils/functions";

const SizeInput = ({ type = "number", value, onChange, required = false, label, max }) => {
  return (
    <div className={styles.size_wrapper}>
      <span className={styles.header_text}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={styles.parameter}
        required={required}
        onKeyDown={hideKeyboard}
        max={max}
      />
    </div>
  )
}

export default SizeInput;