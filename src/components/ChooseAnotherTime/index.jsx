import { useEffect, useRef, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
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

import styles from './ChooseAnotherTime.module.css'

const ChooseAnotherTime = () => {
	const snap = useSnapshot(state);
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
	const [activeRegion, setActiveRegion] = useState("moscow");
  const [addressCoords, setAddressCoords] = useState(null);
	const [address, setAddress] = useState("");
  const [debounceAddressValue] = useDebounce(address, 500);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState("");
  const [selectedDateEnd, setSelectedDateEnd] = useState("");
  const [selectedHourStart, setSelectedHourStart] = useState("00");
  const [selectedMinuteStart, setSelectedMinuteStart] = useState("00");
  const [selectedHourEnd, setSelectedHourEnd] = useState("00");
  const [selectedMinuteEnd, setSelectedMinuteEnd] = useState("00");
  const dateRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];
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
    console.log(selectedDateEnd, selectedDateStart)
    if (link === "/extra-options") {
      if (!address.trim()) {
        showErrorSnackbar({ message: "Не указан адрес", tryAgain: true });
        return;
      }

      if (!addressCoords && !snap.isEditPark) {
        showErrorSnackbar({ message: "Не удалось получить координаты адреса", tryAgain: true });
        return;
      }
    } //делаем валидацию адреса и координат только по клику на кнопку "Далее"

    if (!selectedDateStart || !selectedDateEnd) {
      showErrorSnackbar({ message: "Не указана дата", tryAgain: true })
      return;
    }

    if (!activeRegion) {
      showErrorSnackbar({ message: "Не указан регион", tryAgain: true });
      return;
    }

    const dateStart = new Date(selectedDateStart);
    dateStart.setHours(selectedHourStart);
    dateStart.setMinutes(selectedMinuteStart);

    const dateEnd = new Date(selectedDateEnd);
    dateEnd.setHours(selectedHourEnd);
    dateEnd.setMinutes(selectedMinuteEnd);
    
    if (dateStart >= dateEnd) {
      showErrorSnackbar({ message: "Время начала не может быть больше или равно времени окончания" });
      return;
   }

    state.parkDate = {
      ...snap.parkDate,
      dateStartISO: dateStart.toISOString(),
      dateEndISO: dateEnd.toISOString(),
      hoursStart: selectedHourStart === "00" ? "00" : +selectedHourStart,
      minutesStart: selectedMinuteStart,
      hoursEnd: selectedHourEnd === "00" ? "00" : +selectedHourEnd,
      minutesEnd: selectedMinuteEnd,
      dateStart : selectedDateStart,
      dateEnd: selectedDateEnd,
      region: activeRegion,
      address: address,
      coordinates: addressCoords,
    };

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
      setSelectedHourStart(snap.parkDate.hoursStart || "00");
      setSelectedMinuteStart(snap.parkDate.minutesStart || "00");
      setSelectedHourEnd(snap.parkDate.hoursEnd || "00");
      setSelectedMinuteEnd(snap.parkDate.minutesEnd || "00");
      setSelectedDateStart(snap.parkDate.dateStart || "");
      setSelectedDateEnd(snap.parkDate.dateEnd || "");
      setActiveRegion(snap.parkDate.region || "moscow");
      setAddress(snap.parkDate.address || "");
    }
  }, [snap.user, snap.parkDate]);

  return (
		<>
			<NavBar/>
			<Container>
				<h2 className={styles.title}>
          {snap.isEditPark ? "Редактирование" : "Сдать на другой срок"}
        </h2>
        <div style={{ width: "100%" }}>
          <span className={styles.label}>Дата и время начала</span>
          <div className={styles.date_time_container}>
            <div className={styles.wrapper_input}>
              <input
                ref={dateRef}
                type="date"
                min={currentDate}
                value={selectedDateStart}
                onChange={(e) => setSelectedDateStart(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div onClick={() => setOpenStartTimeModal(true)} className={styles.time_present}>
              {selectedHourStart}:{selectedMinuteStart}
            </div>
          </div>
          <span className={styles.label}>Дата и время окончания</span>
          <div className={styles.date_time_container}>
            <div className={styles.wrapper_input}>
              <input
                ref={dateRef}
                type="date"
                min={currentDate}
                value={selectedDateEnd}
                onChange={(e) => setSelectedDateEnd(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div onClick={() => setOpenEndTimeModal(true)} className={styles.time_present}>
              {selectedHourEnd}:{selectedMinuteEnd}
            </div>
          </div>
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
        </div>
        <ModalTime
          setOpenTimeModal={setOpenStartTimeModal}
          openTimeModal={openStartTimeModal}
          setSelectedMinute={setSelectedMinuteStart}
          setSelectedHour={setSelectedHourStart}
          isToday={false}
        />
        <ModalTime
          setOpenTimeModal={setOpenEndTimeModal}
          openTimeModal={openEndTimeModal}
          setSelectedMinute={setSelectedMinuteEnd}
          setSelectedHour={setSelectedHourEnd}
          isToday={false}
        />
			</Container>
		</>
	)
};

export default ChooseAnotherTime;
