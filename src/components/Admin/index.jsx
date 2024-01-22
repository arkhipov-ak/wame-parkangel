import { useState, useEffect } from "react";
import axios from "axios";
import { useSnapshot } from "valtio";
import ReactCodeInput from "react-code-input";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";

import styles from "./Admin.module.css";
import Logotype from "/src/assets/logo.svg";
import { state } from "src/state";
import { showErrorSnackbar } from "src/utils/showSnackBar";
import { hideKeyboard } from "src/utils/functions";

const Admin = () => {
  const snap = useSnapshot(state)
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(true);

  const onHandleLoginAdminClick = () => {
    if (!nickname.trim()) return showErrorSnackbar({ message: "Telegram-никнейм не может быть пустым", tryAgain: true })

    axios.post(
      "https://api.parkangel.ru/api/users/registration", { telegram: nickname.trim() }
    ).then((response) => {
      if (response.data.response === true) setVerification(true);
      else {
        navigate("/");
        showErrorSnackbar({ message: "Вы не зарегистрированы" })
      }
    }).catch(() => showErrorSnackbar({ message: "Что-то пошло не так" }))
  };

  useEffect(() => {
    setIsCodeCorrect(true);
		if (code.length === 4) {
        axios.post(
          "https://api.parkangel.ru/api/users/verify-admin", { telegram: nickname.trim(), code }
        ).then((response) => {
          if (response.data.response?.message === "User not valid") {
            navigate("/");
            showErrorSnackbar({ message: "У вас нет прав администратора" });
            return;
          }
          if (response.data.response) {
            state.user = response.data.response;
            navigate("/admin/info");
          } else {
            setIsCodeCorrect(false);
            showErrorSnackbar({ message: "Код введен неверно", tryAgain: true });
          }
        }).catch(() => showErrorSnackbar({ message: "Что-то пошло не так" }))
      }
	}, [code]);

  return (
    <div className={styles.wrapper}>
      {
        !isImageLoaded && (
          <div style={{
            width: "9.3125rem",
            height: "9.3125rem",
            borderRadius: "1.9375rem",
            background: "#353536",
          }} />
        )
      }
      <img src={Logotype} alt="Логотип" onLoad={() => setImageLoaded(true)} style={{ display: isImageLoaded ? "block" : "none" }} />
      <p className={styles.text_main}>
        {isImageLoaded ? "Сервис по поиску  и сдаче машино-мест:" : "Загрузка..."}
      </p>
      <span className={styles.text_descr}>
        {isImageLoaded ? "от часа до года" : " "}
      </span>
      {!snap.user && (
        <>
          {verification ? (
            <div className={styles.login_wrapper}>
              <ReactCodeInput
                type="number"
                inputMode="numeric"
                fields={4}
                value={code}
                name="code"
                onChange={setCode}
                isValid={isCodeCorrect}
              />
              <button type="button" onClick={onHandleLoginAdminClick} className={styles.link_button}>
                <span className={styles.link_button_text}>Не пришел код? Отправить повторно!</span>
              </button>
            </div>
          ) : (
            <div className={styles.login_wrapper}>
              <Popover
                title="💡"
                content={
                  <>
                    <p>
                      - В десктопной версии telegram нажмите на три горизонтальные полоски в левом верхнем углу<br/>
                      - Затем нажмите на «настройки»<br/>
                      - В открывшемся окошке, справа от аватарки будет ваш ник. Он начинается с @<br/>
                      - Введите его без @
                    </p>
                  </>
                }
                trigger="click"
                overlayStyle={{maxWidth: "320px"}}
              >
                <button className={styles.link_button}>
                  <span className={styles.link_button_text}>Где посмотреть Telegram-никнейм?</span>
                </button>
              </Popover>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value, "nickname")}
                placeholder="Введите Telegram-никнейм"
                className={styles.home_input}
                type="text"
                onKeyDown={hideKeyboard}
              />
              <button
                type="button"
                onClick={onHandleLoginAdminClick}
                className={styles.login_button}
              >
                Войти в админ-панель
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
