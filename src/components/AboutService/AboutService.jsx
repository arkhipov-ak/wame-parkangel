import styles from "./AboutService.module.css";
import NavBar from "../NavBar";
import Container from "../common/Container";

const AboutService = () => {
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
          <a
            href="https://disk.yandex.ru/d/MAcAxBeYA2VJaA/%D1%81%D0%B4%D0%B0%D1%82%D1%8C%201.mp4"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
              Как разместить свое объявление
          </a>
          <a
            href="https://disk.yandex.ru/d/MAcAxBeYA2VJaA/%D1%81%D0%BD%D1%8F%D1%82%D1%8C%201.mp4"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Как найти парковку
          </a>
        </div>
      </Container>
    </>
  );
};

export default AboutService;
