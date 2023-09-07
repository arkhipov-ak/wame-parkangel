import { useState, useEffect } from "react";
import styles from "./FAQ.module.css";
import NavBar from "../NavBar";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import axios from "axios";
import Container from "../common/Container";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import ZeroData from "../common/ZeroData";

const Faq = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [faqData, setFaqData] = useState([
    /* {
      question: "Вопрос 1",
      answer: "Ответ 1"
    },
    {
      question: "Вопрос 2",
      answer: "Ответ 2"
    },
    {
      question: "Вопрос 3",
      answer: "Ответ 3"
    }, */
  ]);

  useEffect(() => {
    axios
      .get("http://185.238.2.176:5064/api/faq")
      .then((response) => setFaqData(response.data.response))
      .catch(() => showErrorSnackbar({ message: "Не удалось получить вопросы" }));
  }, []);

  console.log(faqData);

  return (
    <>
      <NavBar />
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
                <div
                  className={`${styles.answer} ${
                    activeQuestion === index ? styles.open : ""
                  }`}
                >
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
