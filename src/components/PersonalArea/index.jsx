import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import styles from "./PersonalArea.module.css";
import Container from "../common/Container";
import Button from "../common/Button";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import CustomCheckBox from "../common/CustomCheckbox";

const PersonalArea = () => {
  const snap = useSnapshot(state);
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    city: "",
    password: "",
    isNameVisible: false,
    isPhoneVisible: false,
    isTelegramVisible: false,
  });

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } }
    setData(newObject)
	}

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);

    /* if (id) {
      axios
        .put("/api/users/:id", userData)
        .then((response) => {
          console.log("User data updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    } else {
      axios
        .post("/api/users", userData)
        .then((response) => {
          console.log("New user created:", response.data);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    } */
  };

  return (
    <>
      <NavBar />
      <Container>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Личный кабинет</h2>
          <span className={styles.label}>Ваше имя</span>
          <input
            value={data.name}
            onChange={(e) => onHandleChange(e.target.value, "name")}
            placeholder="Введите имя"
            className={styles.question_input}
            type="text"
          />
            <span className={styles.label}>Ваш номер телефона</span>
            <input
              value={data.phoneNumber}
              onChange={(e) => onHandleChange(e.target.value, "phoneNumber")}
              placeholder="Введите номер"
              className={styles.question_input}
              inputMode="numeric"
              pattern="[+0-9]*"
              type="tel"
            />
            <span className={styles.label}>Ваша почта</span>
            <input
              value={data.email}
              onChange={(e) => onHandleChange(e.target.value, "email")}
              placeholder="Введите email"
              className={styles.question_input}
              type="text"
            />
            <span className={styles.label}>Предпочтительный город</span>
            <input
              value={data.city}
              onChange={(e) => onHandleChange(e.target.value, "city")}
              placeholder="Введите название"
              className={styles.question_input}
              type="text"
            />
            <span className={styles.label}>Пароль (необязательно)</span>
            <input
              value={data.password}
              onChange={(e) => onHandleChange(e.target.value, "password")}
              placeholder="Введите пароль"
              className={styles.question_input}
              type="text"
            />
            <CustomCheckBox checked={data.isNameVisible} onClick={e => onHandleChange(e, "isNameVisible")}>
              Имя
            </CustomCheckBox>
            <CustomCheckBox checked={data.isPhoneVisible} onClick={e => onHandleChange(e, "isPhoneVisible")}>
              Телефон
            </CustomCheckBox>
            <CustomCheckBox checked={data.isTelegramVisible} onClick={e => onHandleChange(e, "isTelegramVisible")}>
              Telegram-никнейм
            </CustomCheckBox>
          <Button type="submit">Сохранить</Button>
        </form>
      </Container>
    </>
  );
};

export default PersonalArea;
