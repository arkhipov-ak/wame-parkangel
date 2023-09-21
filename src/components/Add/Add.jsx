import NavBar from "../NavBar";
import styles from "./Add.module.css";
import edit from "../../assets/edit.svg";
import eye from "../../assets/eye.svg";
import del from "../../assets/delete.svg";

const Add = () => {
  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div>
          <p className={styles.main_text}>Ваши объявления</p>
          <div className={styles.wrapper_cards}>
            <div className={styles.wrapper_rentCard}>
              <p className={styles.rent_location}>Моховая улица, 15/1с1</p>
              <div className={styles.secondRow}>
                <p className={styles.rent_date}>450 руб/ч</p>
                <div className={styles.icons}>
                  <img src={del} />
                  <img src={eye} />
                  <img src={edit} />
                </div>
              </div>
            </div>
            <div className={styles.wrapper_rentCard}>
              <p className={styles.rent_location}>Моховая улица, 15/1с1</p>
              <div className={styles.secondRow}>
                <p className={styles.rent_date}>450 руб/ч</p>
                <div className={styles.icons}>
                  <img src={del} />
                  <img src={eye} />
                  <img src={edit} />
                </div>
              </div>
            </div>
            <div className={styles.wrapper_rentCard}>
              <p className={styles.rent_location}>Моховая улица, 15/1с1</p>
              <div className={styles.secondRow}>
                <p className={styles.rent_date}>450 руб/ч</p>
                <div className={styles.icons}>
                  <img src={del} />
                  <img src={eye} />
                  <img src={edit} />
                </div>
              </div>
            </div>
            <button className={styles.add_new}>Новое объявление</button>
            <button className={styles.show_map}>Посмотреть на карте</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
