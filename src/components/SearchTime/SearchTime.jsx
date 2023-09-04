import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import SelectSearchGive from "./selectSearchGive/selectSearchGive";
import TodayImg from "../../assets/today_img.svg";
import TomorrowImg from "../../assets/tomorrow_image.svg";
import FouinImg from "../../assets/fouin_img.svg";
import styles from "./SearchTime.module.css";
import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { showErrorSnackbar } from "../../utils/showErrorSnackBar";

const SearchTime = () => {
  const [isSearchFromChild, setIsSearchFromChild] = useState(true);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

 /*  useEffect(() => {
    // Здесь производится GET запрос на получение данных о рекламных объявлениях
    axios.get("http://185.238.2.176:5064/api/ad")
      .then(response => setAdData(response.data.response))
      .catch(error => {
        console.error("Error fetching ad data:", error);
      });
  }, []); */

  useEffect(() => {
    window.Telegram.WebApp.ready();
    const tg = window?.Telegram?.WebApp;
    const user = tg.initDataUnsafe.user;
    if (user) {
      const userId = user.id;
      axios.get(`http://185.238.2.176:5064/api/history/userId/${userId}`)
        .then(response => setHistoryData(response.data.response))
        .catch(() => showErrorSnackbar({ message: "Не удалось получить историю аренды", tryAgain: false }))
    }
  }, []);


  return (
    <>
      <NavBar/>
      <Container>
        <SelectSearchGive setIsSearchActiveProp={setIsSearchFromChild} />
        <div className={styles.wrapper_cards}>
          <Link
            to={isSearchFromChild ? "/search-today" : "/ChooseTimeToday"}
            className={styles.card_today}
          >
            {!isImageLoaded && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.9375rem",
                  background: "#0000",
                }}
              />
            )}
            <img
              className={styles.img_today}
              src={TodayImg}
              onLoad={handleImageLoad}
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
            <p className={styles.text_today}>На сегодня</p>
          </Link>
          <Link
            to={isSearchFromChild ? "/search-tomorrow" : "/ChooseTimeTomorrow"}
            className={styles.card_today}
          >
            {!isImageLoaded && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.9375rem",
                  background: "#0000",
                }}
              />
            )}
            <img
              className={styles.img_today}
              src={TomorrowImg}
              onLoad={handleImageLoad}
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
            <p className={styles.text_today}>На завтра</p>
          </Link>
          <Link to="/search-another-time" className={styles.card_today}>
            {!isImageLoaded && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.9375rem",
                  background: "#0000",
                }}
              />
            )}
            <img
              className={styles.img_today}
              src={FouinImg}
              onLoad={handleImageLoad}
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
            <p className={styles.text_today}>На другой срок</p>
            <BiChevronRight className={styles.last_icon}/>
          </Link>
          <a href="#" className={styles.title}>
            {isSearchFromChild ? "Как снять парковку?" : "Как сдать парковку?"}
          </a>
          <div className={styles.wrapper_rent}>
            <h2 className={styles.history}>История аренды</h2>
            <div className={styles.wrapper_rentCard}>
              {historyData.length ? (
                historyData.map((history, index) => (
                  <div key={index} className={styles.wrapper_rentCard}>
                    <p className={styles.rent_location}>{history.location}</p>
                    <div className={styles.secondRow}>
                      <p className={styles.rent_date}>{history.date}</p>
                      <p className={styles.rent_time}>{history.time}</p>
                      <p className={styles.rent_status}>{history.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.no_history}>История аренды пуста</div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SearchTime;
