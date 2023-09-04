import styles from "./Button.module.css";

const Button = ({ type="button", onClick, text }) => {
  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {text}
    </button>
  );
};

export default Button;
