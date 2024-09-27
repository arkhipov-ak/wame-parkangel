import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
import CustomCheckBox from 'src/components/common/CustomCheckbox'
import PriceCounterBlock from 'src/components/common/PriceCounterBlock'
import SizeInput from 'src/components/common/SizeInput'
import SwitchToggle from 'src/components/common/SwitchToggle'
import NavBar from 'src/components/NavBar'
import { state } from 'src/state'
import { showErrorSnackbar, showSuccessSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

import styles from './Options.module.css'

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

const Options = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [data, setData] = useState(defaultData);

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } };
    setData(newObject);
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

    if (!data.priceHour) {
      showErrorSnackbar({ message: "Стоимость в час должна быть больше нуля", tryAgain: true });
      return;
    }
    
    
    if (data.priceHour > 1000000) {
      showErrorSnackbar({ message: "Стоимость в час не должна превышать 1.000.000₽", tryAgain: true });
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

    delete preparedData.user;

    if (snap.options[0]) {
      axios.put(
        "https://api.parkangel.ru/api/options", preparedData
      ).then((response) => {
        if (response) {
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    } else {
      axios.post(
        "https://api.parkangel.ru/api/options", preparedData
      ).then((response) => {
        if (response) {
          showSuccessSnackbar({ message: "Параметры сохранены" })
          navigate(-1);
        }
      }).catch(() => showErrorSnackbar({ message: "Не удалось сохранить параметры" }))
    }
  };

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`https://api.parkangel.ru/api/options/userId/${snap.user.id}`)
        .then((response) => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user]);

  useEffect(() => {
    if (snap && snap.user && snap.options && snap.options[0]) {
      setData(snap.options[0]);
    }
  }, [snap.user, snap.options]);

  return (
    <>
      {data ? (
        <div>
          <NavBar/>
          <Container>
            <form onSubmit={onHandleSaveOptions} className={styles.form}>
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
                <div className={styles.toggle_container}>
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
              <div className={styles.electro_wrapper}>
                <span className={styles.main_text}>Для электромобилей</span>
                <CustomCheckBox checked={data.isVolts} onClick={e => onHandleChange(e, "isVolts")}>
                  220V
                </CustomCheckBox>
                <CustomCheckBox checked={data.isSpecializedCharger} onClick={e => onHandleChange(e, "isSpecializedCharger")}>
                  Специализированная зарядка
                </CustomCheckBox>
              </div>
              <div className={styles.sizes_wrapper}>
                <span className={styles.main_text}>Нестандартные размеры авто, м</span>
                <div className={styles.parent_container}>
                  <SizeInput value={data.height || ""} onChange={e => {
                    const newValue = e.target.value > 10 ? 10 : e.target.value;
                    onHandleChange(newValue, 'height')
                  }}  label="Высота" max={10}/>
                  <SizeInput value={data.length || ""} onChange={e => {
                    const newValue = e.target.value > 20 ? 20 : e.target.value;
                    onHandleChange(newValue, 'length')
                  }}  label="Длина" max={20}/>
                  <SizeInput value={data.width || ""} onChange={e => {
                    const newValue = e.target.value > 10 ? 10 : e.target.value;
                    onHandleChange(newValue, 'width')
                  }} label="Ширина"max={10}/>
                </div>
              </div>
              <div className={styles.price_counter_wrapper}>
                <span className={styles.main_text}>Макс. стоимость в час, руб</span>
                <PriceCounterBlock price={+data.priceHour} setPrice={e => onHandleChange(e, "priceHour")}/>
              </div>
              <Button type="submit">Сохранить параметры</Button>
            </form>
            <Button onClick={onHandleResetOptions}>Сбросить параметры</Button>
          </Container>
        </div>
      ) : <p>Загрузка...</p>}
    </>
  );
};

export default Options;
