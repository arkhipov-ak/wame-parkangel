import React from "react";
import styles from "./AboutService.module.css";
import NavBar from "../NavBar/NavBar";

const AboutService = () => {
  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <p className={styles.aboout_service}>О сервисе</p>
        <p className={styles.descr_service}>
          ПаркАнгел - виртуальный помощник по поиску и сдаче в аренду
          парковочных мест.
        </p>
        <p className={styles.descr_service}>
          🚘 Найди парковку по нужным параметрам. По геолокации или по адресу.
          <br />
          💸 Сдавай свое машиноместо на любой срок - от часа до года.
          <br /> 🅿️ Автобусы, катера, прицепы - сдавайте и снимайте парковки
          любых габаритов.
        </p>
        <p className={styles.instruction}>
          Видеоинструкции: <br/><span className={styles.instruction_descr}>Как разместить свое объявление <br/> Как найти парковку</span>
        </p>
      </div>
    </div>
  );
};

export default AboutService;
