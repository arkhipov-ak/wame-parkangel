import { useState, useEffect } from "react";
import axios from "axios";
import { useSnapshot } from "valtio";
import ReactCodeInput from "react-code-input";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";

import styles from "./Home.module.css";
import Logotype from "/src/assets/logo.svg";
import { state } from "src/state";
import Modal from "src/components/common/Modal";
import Button from "src/components/common/Button";
import { showErrorSnackbar } from "src/utils/showSnackBar";
import { supportLink } from "src/utils/constants";
import { hideKeyboard } from "src/utils/functions";

const Home = () => {
  const snap = useSnapshot(state)
  const [isImageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(true);
  const [registrationLink, setRegistrationLink] = useState("");

  const onHandleSubmit = (e) => {
    e.preventDefault();
    
    if (password === snap.user.password) {
      setOpenPasswordModal(false);
      navigate("/search-time");
    } else {
      showErrorSnackbar({ message: "Неверный пароль", tryAgain: true });
    }
  };

  const onHandleLoginClick = () => {
    if (!nickname.trim()) return showErrorSnackbar({ message: "Telegram-никнейм не может быть пустым", tryAgain: true })

    axios.post(
      "https://api.parkangel.ru/api/users/registration", { telegram: nickname.trim() }
    ).then((response) => {
      if (response.data.response === true) setVerification(true);
      else {
        setVerification(true);
        setRegistrationLink(response.data.response);
      }
    }).catch(() => showErrorSnackbar({ message: "Что-то пошло не так" }))
  };

  useEffect(() => {
    setLoading(true);
    
    const renderAgreementInfo = () => {
      if (!snap.user) return setLoading(false);

      if (snap.user.password) {
        setOpenPasswordModal(true);
        return setLoading(false);
      }

      setLoading(false);
      
      if (snap.user.isAcceptAgreement) navigate("/search-time");
      else navigate("/agreement");
    };
   
    const timer = setTimeout(() => renderAgreementInfo(), 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [snap.user]);

  useEffect(() => {
    setIsCodeCorrect(true);
		if (code.length === 4) {
      axios.post(
        "https://api.parkangel.ru/api/users/verify", { telegram: nickname.trim(), code }
      ).then((response) => {
        if (response.data.response) {
          state.user = response.data.response;
          if (response.data.response.password) return setOpenPasswordModal(true);
          if (response.data.response.dateAcceptAgreement) navigate("/search-time");
          else navigate("/agreement");
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
      {!loading && !snap.user && (
        <>
          {verification ? (
            <div className={styles.login_wrapper}>
              {registrationLink ? (
                <span className={styles.verification_text}>Для регистрации перейдите, пожалуйста, по ссылке
                  в <a href={registrationLink} target="_blank" rel="noopener noreferrer" className={styles.link}>Telegram</a> и введите проверочный код
                </span>
              ) : (
                <span className={styles.verification_text}>
                  Нам нужно верифицировать ваш Telegram, мы выслали вам проверочный код
                </span>
              )}
              <ReactCodeInput
                type="number"
                inputMode="numeric"
                fields={4}
                value={code}
                name="code"
                onChange={setCode}
                isValid={isCodeCorrect}
              />
              <button type="button" onClick={onHandleLoginClick} className={styles.link_button}>
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
                overlayStyle={{maxWidth: "310px"}}
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
              <button type="button" onClick={onHandleLoginClick} className={styles.login_button}>
                Войти
              </button>
            </div>
          )}
        </>
      )}
      <Modal
        setOpenModal={setOpenPasswordModal}
        openModal={openPasswordModal}
        closeButton={false}
      >
        <form onSubmit={onHandleSubmit} className={styles.form}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value, "password")}
            placeholder="Введите пароль"
            className={styles.home_input}
            type="text"
          />
          <div className={styles.text_block}>
            <span>Забыли пароль?</span><br/>
            <a href={supportLink} className={styles.link}>Напишите в поддержку.</a>
          </div>
          <Button type="submit">Войти</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
