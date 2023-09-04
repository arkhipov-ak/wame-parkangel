import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import styles from "./PersonalArea.module.css";
import { Checkbox } from "antd";

const PersonalArea = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [isNameVisible, setNameVisible] = useState(false);
  const [isPhoneVisible, setPhoneVisible] = useState(false);
  const [isTelegramVisible, setTelegramVisible] = useState(false);

  useEffect(() => {
    // Здесь производится GET запрос на получение пользовательских данных
    axios
      .get("/api/users/:id")
      .then((response) => {
        const userData = response.data;
        setName(userData.name);
        setPhoneNumber(userData.phoneNumber);
        setEmail(userData.email);
        setCity(userData.city);
        // Заполните остальные данные
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleSubmit = () => {
    const userData = {
      name,
      handleInputChange,
      email,
      city,
      password,
      // Добавьте остальные поля
    };

    // Отправка POST или PUT запроса в зависимости от ситуации
    if (id) {
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
    }
  };
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value && !value.startsWith("+")) {
      setPhoneNumber("+" + value);
    } else {
      setPhoneNumber(value);
    }
  };

  function scrollToInput(element) {
    setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 5);
  }

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div>
          <p
            style={{
              fontWeight: "500",
              fontSize: "140%",
            }}
          >
            Личный кабинет
          </p>
          <div>
            <p className={styles.question_text}>Ваше имя</p>
            <input
              placeholder="Введите имя"
              onChange={(e) => setName(e.target.value)}
              className={styles.question_input}
              type="text"
              onFocus={scrollToInput}
            />
          </div>
          <div>
            <p className={styles.question_text}>Ваш номер телефона</p>
            <input
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="Введите номер"
              className={styles.question_input}
              inputMode="numeric"
              pattern="[+0-9]*"
              type="tel"
              onFocus={(e) => scrollToInput(e.target)}
            />
          </div>

          <div>
            <p className={styles.question_text}>Ваша почта</p>
            <input
              placeholder="Введите email"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.question_input}
              type="text"
              onFocus={scrollToInput}
            />
          </div>
          <div>
            <p className={styles.question_text}>Предпочтительный город</p>
            <input
              placeholder="Введите название"
              className={styles.question_input}
              type="text"
              onFocus={scrollToInput}
            />
          </div>
          <div>
            <p className={styles.question_text}>Пароль (необязательно)</p>
            <input
              placeholder="Введите пароль"
              onChange={(e) => setPassword(e.target.value)}
              className={styles.question_input}
              type="text"
              onFocus={scrollToInput}
            />
          </div>
          <div>
            <Checkbox
              style={{
                borderRadius: "50%",
                fontSize: "15px",
                alignItems: "center",
                marginTop: "10%",
                fontWeight: "450",
                width: "100%",
                height: "100%",
              }}
              onChange={() => setNameVisible(!isNameVisible)}
            >
              Имя
            </Checkbox>
          </div>
          <div>
            <Checkbox
              style={{
                borderRadius: "50%",
                fontSize: "15px",
                alignItems: "center",
                marginTop: "10%",
                fontWeight: "450",
                width: "100%",
                height: "100%",
              }}
              onChange={() => setNameVisible(!isNameVisible)}
            >
              Телефон
            </Checkbox>
          </div>
          <div>
            <Checkbox
              style={{
                borderRadius: "50%",
                fontSize: "15px",
                alignItems: "center",
                marginTop: "10%",
                fontWeight: "450",
                width: "100%",
                height: "100%",
              }}
              onChange={() => setNameVisible(!isNameVisible)}
            >
              @username в Телеграм
            </Checkbox>
          </div>
          <button onClick={handleSubmit} className={styles.submit}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalArea;
