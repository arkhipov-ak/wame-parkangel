import { useState } from "react";

import styles from "./AboutService.module.css";
import NavBar from "src/components/NavBar";
import Container from "src/components/common/Container";
import ModalVideo from "src/components/common/ModalVideo";
import VideoButton from "src/components/common/VideoButton";

const AboutService = () => {
  const [openRentModal, setOpenRentModal] = useState(false);
  const [openRentOffModal, setOpenRentOffModal] = useState(false);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className={styles.about_service}>О сервисе</h2>
        <p className={styles.text}>
          ПаркАнгел - виртуальный помощник по поиску и сдаче в аренду
          парковочных мест.
        </p>
        <p className={styles.text}>
          🚘 Найди парковку по нужным параметрам. По геолокации или по адресу.
          <br />
          💸 Сдавай свое машиноместо на любой срок - от часа до года.
          <br /> 🅿️ Автобусы, катера, прицепы - сдавайте и снимайте парковки
          любых габаритов.
        </p>
        <span className={styles.text}>Видеоинструкции:</span>
        <div className={styles.links_wrapper}>
          <VideoButton onClick={() => setOpenRentModal(true)}>
              Как разместить свое объявление
          </VideoButton>
          <VideoButton onClick={() => setOpenRentOffModal(true)}>
            Как найти парковку
          </VideoButton>
        </div>
        {openRentModal && (
          <ModalVideo
            title="Как сдать парковку?"
            videoUrl={"videos/rent-off.mp4"}
            openVideoModal={openRentModal}
            setOpenVideoModal={setOpenRentModal}
          />
        )}
        {openRentOffModal && (
          <ModalVideo
            title="Как снять парковку?"
            videoUrl={"videos/rent.mp4"}
            openVideoModal={openRentOffModal}
            setOpenVideoModal={setOpenRentOffModal}
          />
        )}
      </Container>
    </>
  );
};

export default AboutService;
