import { Link } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import styles from "./ParametersButton.module.css";

const ParametersButton = ({ link }) => {
  return (
    <Link to={link} className={styles.btn_style}>
      Доп. параметры <BiChevronRight className={styles.last_icon}/>
    </Link>
  );
};

export default ParametersButton;
