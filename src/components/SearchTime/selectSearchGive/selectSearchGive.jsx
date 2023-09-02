import React, { useState, useEffect } from "react";
import styles from "./selectSearchGive.module.css";

const SelectSearchGive = ({ setIsSearchActiveProp }) => {
  const [isSearchActive, setIsSearchActive] = useState(true);

  useEffect(() => {
    setIsSearchActiveProp(isSearchActive); // передаем состояние в родительский компонент
  }, [isSearchActive]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          className={isSearchActive ? styles.active_btn : styles.notactive_btn}
          onClick={() => setIsSearchActive(true)}
        >
          Найти
        </button>
        <button
          className={!isSearchActive ? styles.active_btn : styles.notactive_btn}
          onClick={() => setIsSearchActive(false)}
        >
          Сдать
        </button>
      </div>
    </div>
  );
};

export default SelectSearchGive;
