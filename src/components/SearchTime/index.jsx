import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import SelectSearchGive from "./selectSearchGive";
import TodayImg from "../../assets/today_img.svg";
import TomorrowImg from "../../assets/tomorrow_image.svg";
import FouinImg from "../../assets/fouin_img.svg";
import styles from "./SearchTime.module.css";
import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { showErrorSnackbar } from "../../utils/showSnackBar";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import ZeroData from "../common/ZeroData";

const SearchTime = () => {
  const snap = useSnapshot(state);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`http://185.238.2.176:5064/api/history/userId/${snap.user.chatId}`)
        .then(response => setHistoryData(response.data.response))
        .catch(() => showErrorSnackbar({ message: "Не удалось получить историю аренды" }))
    }
  }, [snap]);

  return (
    <>
      <NavBar/>
      <Container>
        <SelectSearchGive/>
        <div className={styles.wrapper_cards}>
          <Link
            to={snap.isSearchPark === true ? "/search-today" : "/choose-time-today"}
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
            to={snap.isSearchPark === true ? "/search-tomorrow" : "/ChooseTimeTomorrow"}
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
            {snap.isSearchPark === true ? "Как снять парковку?" : "Как сдать парковку?"}
          </a>
          <div className={styles.wrapper_rent}>
            <h2 className={styles.history}>История аренды</h2>
            
              {historyData.length ? (
                historyData.map((history, index) => (
                  <div key={index} className={styles.wrapper_rentCard}>
                    <div  className={styles.wrapper_rentCard}>
                      <p className={styles.rent_location}>{history.location}</p>
                      <div className={styles.secondRow}>
                        <p className={styles.rent_date}>{history.date}</p>
                        <p className={styles.rent_time}>{history.time}</p>
                        <p className={styles.rent_status}>{history.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <ZeroData>История аренды пуста</ZeroData>
              )}
            </div>
        </div>
      </Container>
    </>
  );
};

export default SearchTime;
