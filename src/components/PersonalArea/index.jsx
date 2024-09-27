import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import ReactInputMask from 'react-input-mask'
import axios from 'src/api/interceptors'
import Button from 'src/components/common/Button'
import Container from 'src/components/common/Container'
import CustomCheckBox from 'src/components/common/CustomCheckbox'
import NavBar from 'src/components/NavBar'
import { state } from 'src/state'
import { showErrorSnackbar, showSuccessSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

import styles from './PersonalArea.module.css'

const PersonalArea = () => {
  const snap = useSnapshot(state);
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    city: "moscow",
    password: "",
    isShowName: false,
    isShowPhoneNumber: false,
    isShowTelegram: true,
    theme: "light",
  });
  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } };
    setData(newObject);
	};

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.isShowName && !data.name.trim().length) {
      showErrorSnackbar({ message: "Если поставили галочку, то заполните имя" });
      return;
    }

    if (data.isShowPhoneNumber && !data.phoneNumber.trim().length) {
      showErrorSnackbar({ message: "Если поставили галочку, то заполните телефон" });
      return;
    }

    axios.put("https://api.parkangel.ru/api/users", data)
      .then(() => {
        showSuccessSnackbar({ message: "Данные профиля обновлены" })
        axios.get(`https://api.parkangel.ru/api/users/chatId/${snap.user.chatId}`)
          .then(() => {
            state.user = data;
            Cookies.set('user', JSON.stringify(data), { expires: 7 });
          })
      })
      .catch(() => showErrorSnackbar({ message: "Не удалось обновить данные профиля" }))
  };

  useEffect(() => {
    if (snap && snap.user) {
      setData(snap.user)
    }
  }, [snap.user]);
  

  return (
    <>
      <NavBar/>
      <Container>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Личный кабинет</h2>
          <span className={styles.label}>Ваше имя</span>
          <input
            value={data.name}
            onChange={(e) => onHandleChange(e.target.value, "name")}
            placeholder="Введите имя"
            className={styles.question_input}
            type="text"
          />
            <span className={styles.label}>Ваш номер телефона</span>
            <ReactInputMask
              mask="+9 (999) 999-99-99"
              maskChar="_"
              value={data.phoneNumber}
              onChange={(e) => onHandleChange(e.target.value, "phoneNumber")}
              placeholder="Введите номер"
              className={styles.question_input}
            />
            <span className={styles.label}>Ваша почта</span>
            <input
              value={data.email}
              onChange={(e) => onHandleChange(e.target.value, "email")}
              placeholder="Введите email"
              className={styles.question_input}
              type="text"
            />
            <span className={styles.label}>Предпочтительный город</span>
            <select
              value={data.city}
              onChange={(e) => onHandleChange(e.target.value, "city")}
              className={styles.region_select}
          >
              <option value="moscow">Москва и область</option>
              <option value="spb">СПб и область</option>
            </select>
            <span className={styles.label}>Пароль (необязательно)</span>
            <input
              value={data.password}
              onChange={(e) => onHandleChange(e.target.value, "password")}
              placeholder="Введите пароль"
              className={styles.question_input}
              type="text"
            />
            <CustomCheckBox checked={data.isShowName} onClick={e => onHandleChange(e, "isShowName")}>
              * Имя
            </CustomCheckBox>
            <CustomCheckBox checked={data.isShowPhoneNumber} onClick={e => onHandleChange(e, "isShowPhoneNumber")}>
              * Телефон
            </CustomCheckBox>
            <p className={styles.paragraph}>
              * Выбранные вами параметры отразятся в размещенном объявлении и станут видимы для соискателей.
            </p>
          <Button type="submit">Сохранить</Button>
        </form>
      </Container>
    </>
  );
};

export default PersonalArea;
