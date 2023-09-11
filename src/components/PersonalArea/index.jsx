import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import styles from "./PersonalArea.module.css";
import Container from "../common/Container";
import Button from "../common/Button";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import CustomCheckBox from "../common/CustomCheckbox";
import { showErrorSnackbar, showSuccessSnackbar } from "../../utils/showSnackBar";

const PersonalArea = () => {
  const snap = useSnapshot(state);
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    city: "",
    password: "",
    isShowName: false,
    isShowPhoneNumber: false,
    isShowTelegram: false,
  });

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } }
    setData(newObject)
	}

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.isShowName && !data.name.trim().length) {
      showErrorSnackbar({ message: "Если поставили галочку, то заполните имя" });
      return;
    }

    if (data.isShowPhoneNumber && !data.phoneNumber.trim().length) {
      showErrorSnackbar({ message: "Если поставили галочку, то заполните телефон" });
      return;
    }

    axios.put("http://185.238.2.176:5064/api/users", data)
      .then(() => showSuccessSnackbar({ message: "Данные профиля обновлены" }))
      .catch(() => showErrorSnackbar({ message: "Не удалось обновить данные профиля" }))
  };

  useEffect(() => {
    if (snap && snap.user) setData(snap.user)
  }, [snap.user]);

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
            <CustomCheckBox checked={data.isShowName} onClick={e => onHandleChange(e, "isShowName")}>
              Имя
            </CustomCheckBox>
            <CustomCheckBox checked={data.isShowPhoneNumber} onClick={e => onHandleChange(e, "isShowPhoneNumber")}>
              Телефон
            </CustomCheckBox>
            <CustomCheckBox checked={data.isShowTelegram} onClick={e => onHandleChange(e, "isShowTelegram")}>
              Telegram-никнейм
            </CustomCheckBox>
          <Button type="submit">Сохранить</Button>
        </form>
      </Container>
    </>
  );
};

export default PersonalArea;
