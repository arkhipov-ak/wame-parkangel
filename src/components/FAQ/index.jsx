import { useState, useEffect } from "react";
import axios from "axios";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

import styles from "./FAQ.module.css";
import NavBar from "src/components/NavBar";
import Container from "src/components/common/Container";
import { showErrorSnackbar } from "src/utils/showSnackBar";
import ZeroData from "src/components/common/ZeroData";

const Faq = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    axios.get(
      "https://api.parkangel.ru/api/faq"
    ).then((response) => setFaqData(response.data.response))
    .catch(() => showErrorSnackbar({ message: "Не удалось получить вопросы" }));
  }, []);

  return (
    <>
      <NavBar/>
      <Container>
        <h2 className={styles.faq}>Частые вопросы</h2>
        {faqData.length ? (
          <>
            {faqData.map((item, index) => (
              <div
                key={index}
                className={styles.wrapper_question}
                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
              >
                <div className={styles.text_with_icon}>
                  <p className={styles.questions}>{item.question}</p>
                  {activeQuestion === index ? (
                    <BiChevronUp className={styles.down_img} />
                  ) : (
                    <BiChevronDown className={styles.down_img} />
                  )}
                </div>
                <div className={`${styles.answer} ${activeQuestion === index ? styles.open : ""}`}>
                  {item.answer}
                </div>
              </div>
            ))}
          </>
        ) : (
          <ZeroData>Вопросов нет</ZeroData>
        )}
      </Container>
    </>
  );
};

export default Faq;
