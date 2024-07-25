import axios from 'axios'
import { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { useNavigate } from 'react-router-dom'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
import HoursCounterBlock from 'src/components/common/HoursCounterBlock'
import ModalTime from 'src/components/common/ModalTime'
import RegionSelect from 'src/components/common/RegionSelect'
import NavBar from 'src/components/NavBar'
import { state } from 'src/state'
import { GEO_SUGGEST_API_KEY } from 'src/utils/constants'
import { hideKeyboard } from 'src/utils/functions'
import { showErrorSnackbar } from 'src/utils/showSnackBar'
import theme from 'src/utils/suggestsTheme.module.css'
import { useDebounce } from 'use-debounce'
import { useSnapshot } from 'valtio'

import styles from './ChooseTimeToday.module.css'

const ChooseTimeDay = ({ day }) => {
  const snap = useSnapshot(state);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [activeRegion, setActiveRegion] = useState("moscow");
  const [selectedHours, setSelectedHours] = useState("00");
  const [selectedMinutes, setSelectedMinutes] = useState("00");
  const [hoursCount, setHoursCount] = useState(1);
  const [addressCoords, setAddressCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [debounceAddressValue] = useDebounce(address, 500);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const onChange = (event, { newValue }) => setAddress(newValue);

  const inputProps = {
    placeholder: "Введите адрес",
    value: address,
    onChange,
    onKeyDown: hideKeyboard,
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    axios.get(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=${GEO_SUGGEST_API_KEY}&text=${value}`
    ).then((response) => {
      if (response.data.results) setSuggestions(response.data.results.map(item => item.title.text));
      else {
        setSuggestions([])
        showErrorSnackbar({ message: "Что-то пошло не так" })
      }
    }).catch(() => showErrorSnackbar({ message: "Не удалось получить список подсказок" }))
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;
  
  const onHandleRedirect = (link) => {
    let hoursEndTemp = +selectedHours + +hoursCount;

    if (link === "/extra-options") {
      if (!activeRegion) {
        showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
        return;
      }

      if (!address.trim()) {
        showErrorSnackbar({ message: "Не указан адрес", tryAgain: true });
        return;
      }

      if (!addressCoords) {
        showErrorSnackbar({ message: "Не удалось получить координаты парковки", tryAgain: true });
        return;
      }
  
      if (hoursEndTemp > 23) {
        showErrorSnackbar({ message: 'Время заходит на следующий день, выберите опцию "На другой срок"' });
        return;
      }
    } //делаем валидацию только по клику на кнопку "Далее"

    if (day === "сегодня") {
      const dateStart = new Date();

      if ((+selectedHours < dateStart.getHours()) ||
          (+selectedHours === dateStart.getHours() && +selectedMinutes < dateStart.getMinutes())
        ) {
        showErrorSnackbar({ message: "Выбранное время уже прошло", tryAgain: true });
        return;
      }

      dateStart.setHours(selectedHours);
      dateStart.setMinutes(selectedMinutes);

      const dateEnd = new Date();
      dateEnd.setHours(hoursEndTemp);
      dateEnd.setMinutes(selectedMinutes);

      state.parkDate = {
        dateStartISO: dateStart.toISOString(),
        dateEndISO: dateEnd.toISOString(),
        hoursStartOneDay: selectedHours === "00" ? "00" : +selectedHours,
        minutesOneDay: selectedMinutes,
        hoursCountOneDay: hoursCount,
        region: activeRegion,
        address: address,
        coordinates: addressCoords,
      };
    }

    if (day === "завтра") {
      const date = new Date();
      const tomorrowStart = new Date(date);
      tomorrowStart.setDate(date.getDate() + 1);
      tomorrowStart.setHours(selectedHours);
      tomorrowStart.setMinutes(selectedMinutes);

      const tomorrowEnd = new Date(date);
      tomorrowEnd.setDate(date.getDate() + 1);
      tomorrowEnd.setHours(hoursEndTemp);
      tomorrowEnd.setMinutes(selectedMinutes);

      state.parkDate = {
        dateStartISO: tomorrowStart.toISOString(),
        dateEndISO: tomorrowEnd.toISOString(),
        hoursStartOneDay: selectedHours === "00" ? "00" : +selectedHours,
        minutesOneDay: selectedMinutes,
        hoursCountOneDay: hoursCount,
        region: activeRegion,
        address: address,
        coordinates: addressCoords,
      };
    }

    navigate(link);
  };

  useEffect(() => {
    if (debounceAddressValue && debounceAddressValue.length > 4) {
      const ymaps = window.ymaps;

      // Поиск координат
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
    if(snap.user.city) {
      setActiveRegion(snap.user.city || "moscow");
    }
    if (snap && snap.user && snap.parkDate) {
      setSelectedHours(snap.parkDate.hoursStartOneDay || "00");
      setSelectedMinutes(snap.parkDate.minutesOneDay  || "00");
      setHoursCount(snap.parkDate.hoursCountOneDay || 1);
      setActiveRegion(snap.parkDate.region || "moscow");
      setAddress(snap.parkDate.address || "");
    }
  }, [snap.user, snap.parkDate]);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className={styles.title}>Сдать на {day}</h2>  
        <span className={styles.label}>Время начала</span>
        <div onClick={() => setOpenTimeModal(true)} className={styles.time_present}>
          {selectedHours}:{selectedMinutes}
        </div>
        <span className={styles.label}>На сколько времени</span>
        <HoursCounterBlock hoursCount={hoursCount} setHoursCount={setHoursCount}/>
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
          <button
            type="button"
            className={styles.btn_style}
            onClick={() => onHandleRedirect("/map")}
            style={{ marginBottom: "15%" }}
          >
            Указать на карте
          </button>
        </div>
        <Button onClick={() => onHandleRedirect("/extra-options")}>
          Далее
        </Button>
        <ModalTime
          setOpenTimeModal={setOpenTimeModal}
          openTimeModal={openTimeModal}
          setSelectedMinute={setSelectedMinutes}
          setSelectedHour={setSelectedHours}
          isToday={day === "сегодня"}
        />
      </Container>
    </>
  );
};

export default ChooseTimeDay;
