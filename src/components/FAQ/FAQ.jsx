import React, { useState, useEffect } from "react";
import styles from "./FAQ.module.css";
import NavBar from "../NavBar";

import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import axios from "axios";

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    // Здесь производится GET запрос на получение данных о FAQ
    axios
      .get("/api/faq")
      .then((response) => {
        setFaqData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQ data:", error);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <p className={styles.faq}>Частые вопросы</p>
        {faqData.map((item, index) => (
          <div
            key={index}
            className={styles.wrapper_question}
            onClick={() =>
              setActiveQuestion(activeQuestion === index ? null : index)
            }
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
      </div>
    </div>
  );
};

export default FAQ;
