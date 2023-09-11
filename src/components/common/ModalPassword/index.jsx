import { useState } from "react";
import styles from "./ModalPassword.module.css";
import Button from "../Button";

const ModalPassword = ({ setOpenModal, openModal }) => {
  const [password, setPassword] = useState("");

  const onHandleSubmit = () => {
    console.log('submit')
  }

  return (
    openModal && (
      <div className={styles.wrapper}>
          <div className={styles.modal}>
            <form onSubmit={onHandleSubmit}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value, "password")}
                placeholder="Введите пароль"
                className={styles.password_input}
                type="text"
              />
              <Button type="submit">Войти</Button>
            </form>
          </div>
          <div className={styles.overlay} onClick={() => setOpenModal(false)}/>
      </div>
    )
  );
};

export default ModalPassword;