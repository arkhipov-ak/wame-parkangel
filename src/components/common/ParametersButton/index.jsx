import { BiChevronRight } from "react-icons/bi";
import styles from "./ParametersButton.module.css";

const ParametersButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.btn_style}>
      Доп. параметры <BiChevronRight className={styles.last_icon}/>
    </button>
  );
};

export default ParametersButton;
