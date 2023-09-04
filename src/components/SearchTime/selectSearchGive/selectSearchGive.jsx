import { useState, useEffect } from "react";
import styles from "./selectSearchGive.module.css";

const SelectSearchGive = ({ setIsSearchActiveProp }) => {
  const [isSearchActive, setIsSearchActive] = useState(true);

  useEffect(() => {
    setIsSearchActiveProp(isSearchActive); // передаем состояние в родительский компонент
  }, [isSearchActive, setIsSearchActiveProp]);

  return (
    <div className={styles.wrapper}>
        <button
          className={isSearchActive ? styles.active_btn : styles.not_active_btn}
          onClick={() => setIsSearchActive(true)}
        >
          Найти
        </button>
        <button
          className={!isSearchActive ? styles.active_btn : styles.not_active_btn}
          onClick={() => setIsSearchActive(false)}
        >
          Сдать
        </button>
    </div>
  );
};

export default SelectSearchGive;
