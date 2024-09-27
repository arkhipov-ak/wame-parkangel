import styles from "./Button.module.css";

const Button = ({ type = "button", onClick, children, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${className}`} // Объединяем стандартные стили с переданными
    >
      {children}
    </button>
  );
};

export default Button;
