import React, { useState,useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import SelectSearchGive from "./selectSearchGive/selectSearchGive";
import TodayImg from "../../assets/today_img.svg";
import TomorrowImg from "../../assets/tomorrow_image.svg";
import FouinImg from "../../assets/fouin_img.svg";
import styles from "./SearchTime.module.css";
import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import ImageSkeleton from "../ImageSkeleton/ImageSkeleton";
const SearchTime = () => {
  const [isSearchFromChild, setIsSearchFromChild] = useState(true);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [adData, setAdData] = useState([]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    // Здесь производится GET запрос на получение данных о рекламных объявлениях
    axios.get("/api/ad")
      .then(response => {
        setAdData(response.data);
      })
      .catch(error => {
        console.error("Error fetching ad data:", error);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <SelectSearchGive setIsSearchActiveProp={setIsSearchFromChild} />
        <div className={styles.wrapper_cards}>
          <Link
            to={isSearchFromChild ? "/SearchToday" : "/ChooseTimeToday"}
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
            to={isSearchFromChild ? "/SearchTomorrow" : "/ChooseTimeTomorrow"}
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
          <Link to="/SearchAnotherTime" className={styles.card_today}>
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
            <BiChevronRight />
          </Link>
          <p className={styles.title}>
            {isSearchFromChild ? "Как снять парковку?" : "Как сдать парковку?"}
          </p>
          <div>
            <p className={styles.history}>История аренды</p>
            <div className={styles.wrapper_rentCard}>
            {adData.length === 0 ? (
              <div className={styles.noAds}>
                У вас пока нет объявлений
              </div>
            ) : (
              adData.map((ad, index) => (
                <div key={index} className={styles.wrapper_rentCard}>
                  <p className={styles.rent_location}>{ad.location}</p>
                  <div className={styles.secondRow}>
                    <p className={styles.rent_date}>{ad.date}</p>
                    <p className={styles.rent_time}>{ad.time}</p>
                    <p className={styles.rent_status}>{ad.status}</p>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTime;
