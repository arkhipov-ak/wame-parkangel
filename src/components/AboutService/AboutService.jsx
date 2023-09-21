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
        <p className={styles.text}>
          Видеоинструкции:<br/>
          <span className={styles.instruction_descr}>Как разместить свое объявление<br/> 
            Как найти парковку
          </span>
        </p>
      </Container>
    </>
  );
};

export default AboutService;
