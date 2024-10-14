import { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
import RegionSelect from 'src/components/common/RegionSelect'

import NavBar from 'src/components/NavBar'
import { state } from 'src/state'
import { API_KEY, GEO_SUGGEST_API_KEY } from 'src/utils/constants'
import { hideKeyboard } from 'src/utils/functions'
import { showErrorSnackbar } from 'src/utils/showSnackBar'
import theme from 'src/utils/suggestsTheme.module.css'
import { useDebounce } from 'use-debounce'
import { useSnapshot } from 'valtio'
import PriceCounterBlock from '../common/PriceCounterBlock/index.jsx'
import styles from './SelectAddressLocation.module.css'

const SelectAddressLocation = () => {
  const snap = useSnapshot(state);
  const [activeRegion, setActiveRegion] = useState("moscow");
  const [addressCoords, setAddressCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [range, setRange] = useState(100);
  const [debounceAddressValue] = useDebounce(address, 500);
  const [suggestions, setSuggestions] = useState([]);
  const [activeNearMeButton, setActiveNearMeButton] = useState(false);
  const [myCoords, setMyCoords] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const navigate = useNavigate();

  const onChange = (event, { newValue }) => setAddress(newValue);

  const inputProps = {
    placeholder: "Введите адрес",
    value: address,
    onChange,
    onKeyDown: hideKeyboard,
    disabled: activeNearMeButton,
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    axios.get(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=${GEO_SUGGEST_API_KEY}&text=${value}`
    ).then((response) => {
      if (response.data.results) {
        setSuggestions(response.data.results.map(item => item.title.text));
      } else {
        setSuggestions([]);
        showErrorSnackbar({ message: "Что-то пошло не так" });
      }
    })
      .catch(() => showErrorSnackbar({ message: "Не удалось получить список подсказок" }));
};

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const onHandleNearMeClick = () => {
    setActiveNearMeButton(!activeNearMeButton);
    setAddress("");
  };

  const onHandleRedirect = (link) => {
    if (!snap.parkDate) {
      showErrorSnackbar({ message: "Не удалось получить данные", tryAgain: true });
      navigate("/search-time");
      return;
    }

    if (link === "/result-search") {
      if (!address.trim() && !myCoords) {
        showErrorSnackbar({ message: "Укажите адрес, либо свои координаты" });
        return;
      }
      console.log(address, addressCoords)
      if (address.trim() && !addressCoords) {
        showErrorSnackbar({ message: "Не удалось получить координаты адреса", tryAgain: true });
        return;
      }
    } //делаем валидацию адреса только по клику на кнопку "Подобрать парковку"

    if (!activeRegion) {
      showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
      return;
    }

    state.options[0] = {
      ...snap.options[0],
      address: address,
      range: range / 1000,
      region: activeRegion,
      availabilityDateEnd: snap.parkDate.dateEndISO,
      availabilityDateStart: snap.parkDate.dateStartISO,
      coordinates: myCoords || addressCoords,
    };

    state.parkDate = { ...snap.parkDate, region: activeRegion }; //записываем регион в стейт, чтобы отобразить его на карте
    
    navigate(link);
  };

  useEffect(() => {
    if (snap.parkDate) setAddress(snap.parkDate.address || "");
  }, [snap.parkDate]);
  
  const getAddress = async (coords) => {
    const response = await  axios.get(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${coords.join(',')}&format=json`
    );
    
    const address =
      response.data.response.GeoObjectCollection.featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.text;
    setAddress(address)
  }

  useEffect(() => {
    if (!activeNearMeButton) {
      setMyCoords(null);
      return;
    }

    const watchID = navigator.geolocation.watchPosition(async function(position) {
      setMyCoords([position.coords.latitude, position.coords.longitude]);
      await getAddress([position.coords.latitude, position.coords.longitude])
    });
    
    return () => {
      navigator.geolocation.clearWatch(watchID);
    }
  }, [activeNearMeButton]);

  useEffect(() => {
    if (debounceAddressValue && debounceAddressValue.length > 4) {
      const ymaps = window.ymaps;

      ymaps.geocode(debounceAddressValue, { results: 1 }).then((response) => {
        const firstGeoObject = response.geoObjects.get(0);
        const cords = firstGeoObject.geometry.getCoordinates();
      
        setAddressCoords([cords[0], cords[1]]);
      }).catch(() => showErrorSnackbar({ message: "Не удалось получить координаты адреса" }))
    } else {
      setAddressCoords(null);
    }
  }, [debounceAddressValue]);
  
  useEffect(() => {
    if(snap.parkDate?.region) {
      setActiveRegion(snap.parkDate.region || "moscow");
    }
     else if(snap.user.city) {
      setActiveRegion(snap.user.city || "moscow");
    }
  }, [])
  
  useEffect(() => {
    if (
      activeRegion &&
      (address.trim() || myCoords) &&
      addressCoords
    ) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
}, [activeRegion, address, myCoords, addressCoords]);

  return (
    <>
      <NavBar/>
      <Container>
        <div className={styles.block_wrapper}>
          <span className={styles.label}>Ваш регион</span>
          <RegionSelect activeRegion={activeRegion} setActiveRegion={setActiveRegion}/>
          <span className={styles.label}>Адрес</span>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={theme}
          />
          <button type="button" className={styles.btn_style} onClick={() => onHandleRedirect("/map")}>
            Указать на карте
          </button>
          <div className={styles.price_counter_wrapper}>
            <span className={styles.main_text}>Макс. радиус, м</span>
            <PriceCounterBlock price={range} setPrice={e => {
              if(e >= 300){
                setRange(300)
              } else if(e <= 50) {
                setRange(50)
              }else{
                setRange(e)
              }
            }} step={50} max={300} min={100} />
          </div>
          <button
            type="button"
            className={`${styles.btn_style} ${activeNearMeButton ? styles.active : ""}`}
            style={{ marginBottom: "15%" }}
            onClick={onHandleNearMeClick}
          >
            Найти рядом со мной
          </button>
        </div>
       <Button
        onClick={() => onHandleRedirect("/result-search")}
        className={`${isButtonActive ? styles.activeButton : styles.inactiveButton}`}
        disabled={!isButtonActive}
      >
        Подобрать парковку
      </Button>
      </Container>
    </>
  );
};

export default SelectAddressLocation;
