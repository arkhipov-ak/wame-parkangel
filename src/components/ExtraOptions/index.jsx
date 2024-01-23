import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import axios from "axios";

import NavBar from "src/components/NavBar";
import styles from "./ExtraOptions.module.css";
import Container from "src/components/common/Container";
import CustomCheckBox from "src/components/common/CustomCheckbox";
import SwitchToggle from "src/components/common/SwitchToggle";
import Button from "src/components/common/Button";
import PriceCounterBlock from "src/components/common/PriceCounterBlock";
import Modal from "src/components/common/Modal";
import { state } from "src/state";
import { showErrorSnackbar, showSuccessSnackbar } from "src/utils/showSnackBar";
import SizeInput from "src/components/common/SizeInput";

const defaultData = {
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
  isSpecializedCharger: false,
  address: "",
  region: "",
};

const ExtraOptions = () => {
  const snap = useSnapshot(state);
  const [hourModalOpen, setHourModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const [isRenewable, setIsRenewable] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState(defaultData);

  const onHandleChange = (newData) => setData(newData);

  const handleRedirect = () => {
    if (snap.parkDate.hoursCountOneDay && snap.parkDate.hoursStartOneDay && snap.parkDate.minutesOneDay) {
      if (!data.priceHour) {
        showErrorSnackbar({ message: "Стоимость в час должна быть больше нуля", tryAgain: true });
        return;
      }
    } //если сдаем парковку на один день, то обязательно должны указать цену в час

    if (!data.priceHour && !data.priceDay && !data.priceWeek && !data.priceMonth) {
      showErrorSnackbar({ message: "Цена не указана", tryAgain: true });
      return;
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

    if (!snap.parkDate.coordinates) {
      showErrorSnackbar({ message: "Координаты не определены", tryAgain: true });
      navigate("/search-time")
      return;
    }

    if (snap.isEditPark) {
      state.parkDate = { ...snap.parkDate, isRenewable };
      state.options[0] = data;
      return navigate("/review");
    }

    const preparedData = {
      ...data,
      length: data.length ? +data.length : null,
      height: data.height ? +data.height : null,
      width: data.width ? +data.width : null,
      priceHour: data.priceHour ?? null,
      priceDay: data.priceDay ?? null,
      priceWeek: data.priceWeek ?? null,
      priceMonth: data.priceMonth ?? null,
      address: snap.parkDate.address,
      region: snap.parkDate.region,
      user_id: snap.user.id,
      availabilityDateEnd: snap.parkDate.dateEndISO,
      availabilityDateStart: snap.parkDate.dateStartISO,
      coordinates: snap.parkDate.coordinates.join(", "),
    };

    delete preparedData.user;
    delete preparedData.id;

    axios.post(
      "https://api.parkangel.ru/api/park", preparedData
    ).then((response) => {
      console.log('response', response);
      console.log('data', data);
      console.log('snap', snap);
      if (response) {
        state.parkDate = { ...snap.parkDate, isRenewable, park_id: response.data.response.id };
        state.options[0] = data;
        navigate("/review");
      }
    }).catch(() => showErrorSnackbar({ message: "Не удалось создать парковку" }))
  };

  const onHandleResetOptions = () => setData({ ...defaultData, id: snap.options[0].id });

  const onHandleSaveOptions = (e) => {
    e.preventDefault();

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

    if (!data.priceHour && !data.priceDay && !data.priceWeek && !data.priceMonth) {
      showErrorSnackbar({ message: "Цена не указана", tryAgain: true });
      return;
    }

    const preparedData = {
      ...data,
      length: data.length ? +data.length : null,
      height: data.height ? +data.height : null,
      width: data.width ? +data.width : null,
      priceHour: data.priceHour ?? null,
      priceDay: data.priceDay ?? null,
      priceWeek: data.priceWeek ?? null,
      priceMonth: data.priceMonth ?? null,
      user_id: snap.user.id,
    };

    if (snap.options[0]) {
      axios.put(
        "https://api.parkangel.ru/api/options", preparedData
      ).then((response) => {
        if (response) {
          state.options[0] = preparedData;
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    } else {
      axios.post(
        "https://api.parkangel.ru/api/options", preparedData
      ).then((response) => {
        if (response) {
          state.options[0] = preparedData;
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    }
  };

  useEffect(() => {
    if (snap && snap.user) {
      if (snap.isSearchPark === false) return;
      axios.get(`https://api.parkangel.ru/api/options/userId/${snap.user.id}`)
        .then(response => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user, snap.isSearchPark]);

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) {
      /* if (snap.isSearchPark === false && snap.isEditPark === false) return; */
      /* if (snap.isEditPark) */ setIsRenewable(!!snap.parkDate.isRenewable);
      setData(snap.options[0]);
    }
  }, [snap.user, snap.options, snap.isSearchPark, snap.isEditPark]);

  useEffect(() => {
    if (snap && snap.user) {
      if (snap.isSearchPark === null || snap.isEditPark === null) {
        showErrorSnackbar({ message: "Пожалуйста, повторите попытку" });
        navigate("/search-time");
      }
    }
  }, [snap.user, snap.isSearchPark, snap.isEditPark]);

  return (
		<>
			<NavBar/>
			<Container>
        <form onSubmit={onHandleSaveOptions} className={styles.form}>
          <div className={styles.container}>
            <div className={styles.box_container}>
              <span className={styles.main_text}>Тип парковки</span>
              <CustomCheckBox
                checked={data.isUnderground}
                onClick={(e) => {
                  if (snap.isSearchPark === true) {
                    onHandleChange({...data, ["isUnderground"]: e});
                    return;
                  }
                  if (data.isUnderground) {
                    onHandleChange({...data, ["isUnderground"]: false});
                    return;
                  }
                  onHandleChange({
                    ...data,
                    ["isUnderground"]: true,
                    ["isOutDoor"]: false,
                    ["isCovered"]: false,
                    ["isGarage"]: false
                  });
                }}
              >
                Подземная
              </CustomCheckBox>
              <CustomCheckBox
                checked={data.isOutDoor}
                onClick={(e) => {
                  if (snap.isSearchPark === true) {
                    onHandleChange({...data, ["isOutDoor"]: e});
                    return;
                  }
                  if (data.isOutDoor) {
                    onHandleChange({...data, ["isOutDoor"]: false});
                    return;
                  }
                  onHandleChange({
                    ...data,
                    ["isOutDoor"]: true,
                    ["isUnderground"]: false,
                    ["isCovered"]: false,
                    ["isGarage"]: false
                  });
                }}
              >
                Открытая
              </CustomCheckBox>
              <CustomCheckBox
                checked={data.isCovered}
                onClick={(e) => {
                  if (snap.isSearchPark === true) {
                    onHandleChange({...data, ["isCovered"]: e});
                    return;
                  }
                  if (data.isCovered) {
                    onHandleChange({...data, ["isCovered"]: false});
                    return;
                  }
                  onHandleChange({
                    ...data,
                    ["isCovered"]: true,
                    ["isOutDoor"]: false,
                    ["isUnderground"]: false,
                    ["isGarage"]: false
                  });
                }}
              >
                Крытая
              </CustomCheckBox>
              <CustomCheckBox
                checked={data.isGarage}
                onClick={(e) => {
                  if (snap.isSearchPark === true) {
                    onHandleChange({...data, ["isGarage"]: e});
                    return;
                  }
                  if (data.isGarage) {
                    onHandleChange({...data, ["isGarage"]: false});
                    return;
                  }
                  onHandleChange({
                    ...data,
                    ["isGarage"]: true,
                    ["isOutDoor"]: false,
                    ["isCovered"]: false,
                    ["isUnderground"]: false
                  });
                }}
              >
                Гараж
              </CustomCheckBox>
            </div>
            <div className={styles.box_container}>
              <span className={styles.main_text}>Доп. опции</span>
              <label>
                <SwitchToggle active={data.isProtected} onClick={(e) => onHandleChange({...data, ["isProtected"]: e})}/>
                Охрана
              </label>
              <label>
                <SwitchToggle active={data.isHeated} onClick={(e) => onHandleChange({...data, ["isHeated"]: e})}/>
                Обогрев
              </label>
            </div>
          </div>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Для электромобилей</span>
            <CustomCheckBox
              checked={data.isVolts}
              onClick={(e) => {
                if (snap.isSearchPark === true) {
                  onHandleChange({...data, ["isVolts"]: e});
                  return;
                }
                if (data.isVolts) {
                  onHandleChange({...data, ["isVolts"]: false});
                  return;
                }
                onHandleChange({
                  ...data,
                  ["isVolts"]: true,
                  ["isSpecializedCharger"]: false
                });
              }}
            >
              220V
            </CustomCheckBox>
            <CustomCheckBox
              checked={data.isSpecializedCharger}
              onClick={(e) => {
                if (snap.isSearchPark === true) {
                  onHandleChange({...data, ["isSpecializedCharger"]: e});
                  return;
                }
                if (data.isSpecializedCharger) {
                  onHandleChange({...data, ["isSpecializedCharger"]: false});
                  return;
                }
                onHandleChange({
                  ...data,
                  ["isSpecializedCharger"]: true,
                  ["isVolts"]: false
                });
              }}
            >
              Специализированная зарядка
            </CustomCheckBox>
          </div>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Нестандартные размеры авто, м</span>
            <div className={styles.parent_container}>
              <SizeInput
                value={data.height || ""}
                onChange={(e) => onHandleChange({...data, ["height"]: e.target.value})}
                label="Высота"
              />
              <SizeInput
                value={data.length || ""}
                onChange={(e) => onHandleChange({...data, ["length"]: e.target.value})}
                label="Длина"
              />
              <SizeInput
                value={data.width || ""}
                onChange={e => onHandleChange({...data, ["width"]: e.target.value})}
                label="Ширина"
              />
            </div>
          </div>
          <div className={styles.box_container}>
            {(snap.parkDate?.hoursCountOneDay || snap.parkDate?.hoursStartOneDay || snap.parkDate?.minutesOneDay) ? (
              <>
                <span className={styles.main_text}>Стоимость в час, руб</span>
                <PriceCounterBlock
                  price={data.priceHour ? +data.priceHour : 0}
                  setPrice={(e) => onHandleChange({...data, ["priceHour"]: e})}
                />
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
                    <p className={styles.header_text}>Цена за месяц</p>
                    <p onClick={() => setMonthModalOpen(true)} className={styles.parameter}>
                      {data.priceMonth ?? 0}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          {snap.isSearchPark === false && (
            <div className={styles.box_container}>
              <CustomCheckBox checked={isRenewable} onClick={() => setIsRenewable(!isRenewable)}>
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
        <Button onClick={onHandleResetOptions}>Сбросить параметры</Button>
        {hourModalOpen && (
          <Modal 
            setOpenModal={setHourModalOpen}
            openModal={hourModalOpen}
            title="Изменить цену за час"
          >
            <>
              <PriceCounterBlock
                price={data.priceHour ?? 0}
                setPrice={e => onHandleChange({...data, ["priceHour"]: e})}
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
                setPrice={e => onHandleChange({...data, ["priceDay"]: e})}
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
                setPrice={e => onHandleChange({...data, ["priceWeek"]: e})}
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
                setPrice={e => onHandleChange({...data, ["priceMonth"]: e})}
                currency
                step={1000}
              />
              <Button onClick={() => setMonthModalOpen(false)}>Готово</Button>
            </>
          </Modal>
        )}
			</Container>
		</>
	)
};

export default ExtraOptions;
