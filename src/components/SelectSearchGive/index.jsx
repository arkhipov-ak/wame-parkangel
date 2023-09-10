import styles from "./SelectSearchGive.module.css";
import { state } from "../../state";
import { useSnapshot } from "valtio";

const SelectSearchGive = () => {
  const snap = useSnapshot(state);

  return (
    <div className={styles.wrapper}>
        <button
          className={snap.isSearchPark === true ? styles.active_btn : styles.not_active_btn}
          onClick={() => state.isSearchPark = true}
        >
          Найти
        </button>
        <button
          className={snap.isSearchPark === false ? styles.active_btn : styles.not_active_btn}
          onClick={() => state.isSearchPark = false}
        >
          Сдать
        </button>
    </div>
  );
};

export default SelectSearchGive;
