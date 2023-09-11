import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import styles from "./ExtraOptions.module.css";
import Container from "../common/Container";
import CustomCheckBox from "../common/CustomCheckbox";
import SwitchToggle from "../common/SwitchToggle";
import Button from "../common/Button";
import PriceCounterBlock from "../common/PriceCounterBlock";
import Modal from "../common/Modal";
import { useSnapshot } from "valtio";
import { state } from "../../state";
import { showErrorSnackbar, showSuccessSnackbar } from "../../utils/showSnackBar";
import axios from "axios";
import SizeInput from "../common/SizeInput";

const ExtraOptions = () => {
  const snap = useSnapshot(state);
  /* const [openStartTimeModal, setOpenStartTimeModal] = useState(false); */
  /* const [openEndTimeModal, setOpenEndTimeModal] = useState(false); */
  const [hourModalOpen, setHourModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    priceHour: null,
    priceDay: null,
    priceWeek: null,
    priceMonth: null,
    height: "",
    width: "",
    length: "",
    isUnderground: false,
    isOutDoor: false,
    isCovered: false,
    isGarage : false,
    isProtected: false,
    isHeated: false,
    isVolts: false,
    isElectroMobile: false,
    isVoltsWithCharger: false,
    isWithoutPower: false,
    isCustomSize: false,
    address: "",
    region: "",
    isRenewable: false,
  });

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } }
    setData(newObject)
	};

  const handleRedirect = () => {
    if (snap.parkDate.hoursCountOneDay && snap.parkDate.hoursStartOneDay && snap.parkDate.minutesOneDay) {
      if (!data.priceHour) {
        showErrorSnackbar({ message: "Стоимость в час должна быть больше нуля", tryAgain: true });
        return;
      }
    }

    if (data.height && +data.height <= 0) {
      showErrorSnackbar({ message: "Высота должна быть больше нуля", tryAgain: true });
      return;
    }

    if (data.length && +data.length <= 0) {
      showErrorSnackbar({ message: "Длина должна быть больше нуля", tryAgain: true });
      return;
    }

    if (data.width && +data.width <= 0) {
      showErrorSnackbar({ message: "Ширина должна быть больше нуля", tryAgain: true });
      return;
    }

    state.parkDate = { ...snap.parkDate, isRenewable: data.isRenewable };

    const preparedData = {
      ...data,
      length: data.length ? +data.length : null,
      height: data.height ? +data.height : null,
      width: data.width ? +data.width : null,
      address: snap.parkDate.address,
      region: snap.parkDate.region,
      user_id: snap.user.id,
    };

    if (!preparedData.height) delete preparedData.height;
    if (!preparedData.width) delete preparedData.width;
    if (!preparedData.length) delete preparedData.length;
    if (!preparedData.priceHour) delete preparedData.priceHour;
    if (!preparedData.priceDay) delete preparedData.priceDay;
    if (!preparedData.priceWeek) delete preparedData.priceWeek;
    if (!preparedData.priceMonth) delete preparedData.priceMonth;
    delete preparedData.user;
    delete preparedData.isRenewable;

    if (snap.options[0]) {
      axios.put(
        "http://185.238.2.176:5064/api/options", preparedData
      ).then(response => {
        if (response) showSuccessSnackbar({ message: "Параметры сохранены" });
      })
      .catch(showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    } else {
      axios.post(
        "http://185.238.2.176:5064/api/options", preparedData
      ).then(response => {
        if (response) showSuccessSnackbar({ message: "Параметры сохранены" });
      })
      .catch(showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    }

    const preparedParkData = {
      ...preparedData,
      availabilityDateEnd: snap.parkDate.dateEndISO,
      availabilityDateStart: snap.parkDate.dateStartISO,
    };

    delete preparedParkData.id;

    axios.post(
      "http://185.238.2.176:5064/api/park", preparedParkData
    ).then(response => {
      if (response) navigate("/review");
    })
    .catch(showErrorSnackbar({ message: "Не удалось создать парковку" }))
  };

  const onHandleSaveOptions = (e) => {
    e.preventDefault();

    if (data.height && +data.height <= 0) {
      showErrorSnackbar({ message: "Высота должна быть больше нуля", tryAgain: true });
      return;
    }

    if (data.length && +data.length <= 0) {
      showErrorSnackbar({ message: "Длина должна быть больше нуля", tryAgain: true })
      return;
    }

    if (data.width && +data.width <= 0) {
      showErrorSnackbar({ message: "Ширина должна быть больше нуля", tryAgain: true })
      return;
    }

    const preparedData = {
      ...data,
      length: data.length ? +data.length : null,
      height: data.height ? +data.height : null,
      width: data.width ? +data.width : null,
      user_id: snap.user.id,
    }

    if (!preparedData.height) delete preparedData.height;
    if (!preparedData.width) delete preparedData.width;
    if (!preparedData.length) delete preparedData.length;
    if (!preparedData.priceHour) delete preparedData.priceHour;
    if (!preparedData.priceDay) delete preparedData.priceDay;
    if (!preparedData.priceWeek) delete preparedData.priceWeek;
    if (!preparedData.priceMonth) delete preparedData.priceMonth;

    if (snap.options[0]) {
      axios.put(
        "http://185.238.2.176:5064/api/options", preparedData
      ).then(response => {
        if (response) {
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      })
      .catch(showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    } else {
      axios.post(
        "http://185.238.2.176:5064/api/options", preparedData
      ).then(response => {
        if (response) {
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      })
      .catch(showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    }
  };

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`http://185.238.2.176:5064/api/options/userId/${snap.user.id}`)
        .then(response => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user]);

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) setData(snap.options[0]);
  }, [snap.user, snap.options]);

  useEffect(() => {
    if (snap && snap.user) {
      if (snap.isSearchPark === null) {
        showErrorSnackbar({ message: "Пожалуйста, повторите попытку" });
        navigate("/search-time");
      }
    }
  }, [snap.user, snap.isSearchPark]);

  return (
		<>
			<NavBar/>
			<Container>
        <form onSubmit={onHandleSaveOptions}>
          {/* <div className={styles.box_container}>
            <span className={styles.main_text}>Период</span>
            <div className={styles.periods_wrapper}>
              <div className={styles.period}>
                <p className={styles.header_text}>Начиная с</p>
                <p onClick={() => setOpenStartTimeModal(true)} className={styles.parameter}>
                  {selectedHourStart}:{selectedMinuteStart}
                </p>
              </div>
              <div className={styles.period}>
                <p className={styles.header_text}>По</p>
                <p onClick={() => setOpenEndTimeModal(true)} className={styles.parameter}>
                  {selectedHourEnd}:{selectedMinuteEnd}
                </p>
              </div>
            </div>
          </div> */}
          <div className={styles.container}>
            <div className={styles.box_container}>
              <span className={styles.main_text}>Тип парковки</span>
              <CustomCheckBox checked={data.isUnderground} onClick={e => onHandleChange(e, "isUnderground")}>
                Подземная
              </CustomCheckBox>
              <CustomCheckBox checked={data.isOutDoor} onClick={e => onHandleChange(e, "isOutDoor")}>
                Открытая
              </CustomCheckBox>
              <CustomCheckBox checked={data.isCovered} onClick={e => onHandleChange(e, "isCovered")}>
                Крытая
              </CustomCheckBox>
              <CustomCheckBox checked={data.isGarage} onClick={e => onHandleChange(e, "isGarage")}>
                Гараж
              </CustomCheckBox>
            </div>
            <div className={styles.box_container}>
              <span className={styles.main_text}>Доп. опции</span>
              <label>
                <SwitchToggle active={data.isProtected} onClick={e => onHandleChange(e, "isProtected")}/>
                Охрана
              </label>
              <label>
                <SwitchToggle active={data.isHeated} onClick={e => onHandleChange(e, "isHeated")}/>
                Обогрев
              </label>
            </div>
          </div>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Для электромобилей</span>
            <CustomCheckBox checked={data.isVolts} onClick={e => onHandleChange(e, "isVolts")}>
              220V
            </CustomCheckBox>
            <CustomCheckBox checked={data.isElectroMobile} onClick={e => onHandleChange(e, "isElectroMobile")}>
              Электромобиль
            </CustomCheckBox>
            <CustomCheckBox checked={data.isVoltsWithCharger} onClick={e => onHandleChange(e, "isVoltsWithCharger")}>
              220V и зарядка электромобиля
            </CustomCheckBox>
            <CustomCheckBox checked={data.isWithoutPower} onClick={e => onHandleChange(e, "isWithoutPower")}>
              Без электропитания
            </CustomCheckBox>
            <label>
              <SwitchToggle active={data.isCustomSize} onClick={e => onHandleChange(e, "isCustomSize")}/>
              Нестандартные размеры авто
            </label>
          </div>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Размеры, м</span>
            <div className={styles.parent_container}>
              <SizeInput value={data.height || ""} onChange={e => onHandleChange(e.target.value, "height")} label="Высота"/>
              <SizeInput value={data.length || ""} onChange={e => onHandleChange(e.target.value, "length")} label="Длина"/>
              <SizeInput value={data.width || ""} onChange={e => onHandleChange(e.target.value, "width")} label="Ширина"/>
            </div>
          </div>
          <div className={styles.box_container}>
            {(snap.parkDate.hoursCountOneDay || snap.parkDate.hoursStartOneDay || snap.parkDate.minutesOneDay) ? (
              <>
                <span className={styles.main_text}>Макс. стоимость в час, руб</span>
                <PriceCounterBlock price={+data.priceHour} setPrice={e => onHandleChange(e, "priceHour")}/>
              </>
            ) : (
              <>
                <span className={styles.main_text}>Цены, руб</span>
                <div className={styles.price_blocks}>
                  <div className={styles.period}>
                    <p className={styles.header_text}>Цена за час</p>
                    <p onClick={() => setHourModalOpen(true)} className={styles.parameter}>
                      {data.priceHour ?? 0}
                    </p>
                  </div>
                  <div className={styles.period}>
                    <p className={styles.header_text}>Цена за день</p>
                    <p onClick={() => setDayModalOpen(true)} className={styles.parameter}>
                      {data.priceDay ?? 0}
                    </p>
                  </div>
                  <div className={styles.period}>
                    <p className={styles.header_text}>Цена за неделю</p>
                    <p onClick={() => setWeekModalOpen(true)} className={styles.parameter}>
                      {data.priceWeek ?? 0}
                    </p>
                  </div>
                  <div className={styles.period}>
                    <div className={styles.size_wrapper_2}>
                      <p className={styles.header_text}>Цена за месяц</p>
                      <p onClick={() => setMonthModalOpen(true)} className={styles.parameter}>
                        {data.priceMonth ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {snap.isSearchPark === false && (
            <div className={styles.box_container}>
              <CustomCheckBox checked={data.isRenewable} onClick={e => onHandleChange(e, "isRenewable")}>
                Возобновлять объявление
                <br />
                после завершения аренды
              </CustomCheckBox>
            </div>
          )}
          {snap.isSearchPark === true ? (
            <Button type="submit">Сохранить параметры</Button>
          ) : (
            <Button onClick={handleRedirect}>Далее</Button>
          )}
        </form>
        {hourModalOpen && (
          <Modal 
            setOpenModal={setHourModalOpen}
            openModal={hourModalOpen}
            title="Изменить цену за час"
          >
            <>
              <PriceCounterBlock
                price={data.priceHour ?? 0}
                setPrice={e => onHandleChange(e, "priceHour")}
                currency
              />
              <Button onClick={() => setHourModalOpen(false)}>Готово</Button>
            </>
          </Modal>
        )}
        {dayModalOpen && (
          <Modal
            setOpenModal={setDayModalOpen}
            openModal={dayModalOpen}
            title="Изменить цену за день"
          >
            <>
              <PriceCounterBlock
                price={data.priceDay ?? 0}
                setPrice={e => onHandleChange(e, "priceDay")}
                currency
                step={100}
              />
              <Button onClick={() => setDayModalOpen(false)}>Готово</Button>
            </>
          </Modal>
        )}
        {weekModalOpen && (
          <Modal
            setOpenModal={setWeekModalOpen}
            openModal={weekModalOpen}
            title="Изменить цену за неделю"
          >
            <>
              <PriceCounterBlock
                price={data.priceWeek ?? 0}
                setPrice={e => onHandleChange(e, "priceWeek")}
                currency
                step={500}
              />
              <Button onClick={() => setWeekModalOpen(false)}>Готово</Button>
            </>
          </Modal>
        )}
        {monthModalOpen && (
          <Modal
            setOpenModal={setMonthModalOpen}
            openModal={monthModalOpen}
            title="Изменить цену за месяц"
          >
            <>
              <PriceCounterBlock
                price={data.priceMonth ?? 0}
                setPrice={e => onHandleChange(e, "priceMonth")}
                currency
                step={1000}
              />
              <Button onClick={() => setMonthModalOpen(false)}>Готово</Button>
            </>
          </Modal>
        )}
        {/* {openStartTimeModal && (
          <ModalTime
            setOpenTimeModal={setOpenStartTimeModal}
            openTimeModal={openStartTimeModal}
            setSelectedMinute={setSelectedMinuteStart}
            setSelectedHour={setSelectedHourStart}
          />
        )}
        {openEndTimeModal && (
          <ModalTime
            setOpenTimeModal={setOpenEndTimeModal}
            openTimeModal={openEndTimeModal}
            setSelectedMinute={setSelectedMinuteEnd}
            setSelectedHour={setSelectedHourEnd}
          />
        )} */}
			</Container>
		</>
	)
};

export default ExtraOptions;
