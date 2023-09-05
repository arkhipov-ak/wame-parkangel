import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import styles from "./ExtraOptions.module.css";
import Container from "../common/Container";
import ModalTime from "../common/ModalTime";
import CustomCheckBox from "../common/CustomCheckbox";
import SwitchToggle from "../common/SwitchToggle";
import Button from "../common/Button";
import PriceCounterBlock from "../common/PriceCounterBlock";
import Modal from "../common/Modal";

const ExtraOptions = () => {
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
  const [selectedHourStart, setSelectedHourStart] = useState("00");
  const [selectedMinuteStart, setSelectedMinuteStart] = useState("00");
  const [selectedHourEnd, setSelectedHourEnd] = useState("00");
  const [selectedMinuteEnd, setSelectedMinuteEnd] = useState("00");
  const [hourModalOpen, setHourModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    hourPrice: 0,
    dayPrice: 0,
    weekPrice: 0,
    monthPrice: 0,
    height: "",
    width: "",
    length: "",
    underground: false,
    open: false,
    covered: false,
    garage: false,
    security: false,
    heating: false,
    electroVolts: false,
    electro: false,
    electroVoltsAndCharger: false,
    electroWithoutPower: false,
    nonStandardSizes: false,
    resumeAds: false,
})

  const onHandleChange = (value, key) => {
    let newObject = { ...data, ...{ [key]: value } }
    setData(newObject)
	}

  const handleRedirect = () => {
    
    navigate("/review", { state: data });
  };

  return (
		<>
			<NavBar/>
			<Container>
				<div className={styles.box_container}>
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
				</div>
        <div className={styles.container}>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Тип парковки</span>
            <CustomCheckBox checked={data.underground} onClick={e => onHandleChange(e, "underground")}>Подземная</CustomCheckBox>
            <CustomCheckBox checked={data.open} onClick={e => onHandleChange(e, "open")}>Открытая</CustomCheckBox>
            <CustomCheckBox checked={data.covered} onClick={e => onHandleChange(e, "covered")}>Крытая</CustomCheckBox>
            <CustomCheckBox checked={data.garage} onClick={e => onHandleChange(e, "garage")}>Гараж</CustomCheckBox>
          </div>
          <div className={styles.box_container}>
            <span className={styles.main_text}>Доп. опции</span>
            <label>
              <SwitchToggle active={data.security} onClick={e => onHandleChange(e, "security")}/>
              Охрана
            </label>
            <label>
              <SwitchToggle active={data.heating} onClick={e => onHandleChange(e, "heating")}/>
              Обогрев
            </label>
          </div>
        </div>
        <div className={styles.box_container}>
          <span className={styles.main_text}>Для электромобилей</span>
          <CustomCheckBox checked={data.electroVolts} onClick={e => onHandleChange(e, "electroVolts")}>220V</CustomCheckBox>
          <CustomCheckBox checked={data.electro} onClick={e => onHandleChange(e, "electro")}>Электромобиль</CustomCheckBox>
          <CustomCheckBox checked={data.electroVoltsAndCharger} onClick={e => onHandleChange(e, "electroVoltsAndCharger")}>
            220V и зарядка электромобиля
          </CustomCheckBox>
          <CustomCheckBox checked={data.electroWithoutPower} onClick={e => onHandleChange(e, "electroWithoutPower")}>
            Без электропитания
          </CustomCheckBox>
          <label>
            <SwitchToggle active={data.nonStandardSizes} onClick={e => onHandleChange(e, "nonStandardSizes")}/>
            Нестандартные размеры авто
          </label>
        </div>
        <div className={styles.box_container}>
          <span className={styles.main_text}>Цены</span>
          <div className={styles.price_blocks}>
            <div className={styles.period}>
              <p className={styles.header_text}>Цена за час</p>
              <p onClick={() => setHourModalOpen(true)} className={styles.parameter}>
                {data.hourPrice} руб
              </p>
            </div>
            <div className={styles.period}>
              <p className={styles.header_text}>Цена за день</p>
              <p onClick={() => setDayModalOpen(true)} className={styles.parameter}>
                {data.dayPrice} руб
              </p>
            </div>

            <div className={styles.period}>
              <p className={styles.header_text}>Цена за неделю</p>
              <p onClick={() => setWeekModalOpen(true)} className={styles.parameter}>
                {data.weekPrice} руб
              </p>
            </div>
            <div className={styles.period}>
              <div className={styles.size_wrapper_2}>
                <p className={styles.header_text}>Цена за месяц</p>
                <p onClick={() => setMonthModalOpen(true)} className={styles.parameter}>
                  {data.monthPrice} руб
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.box_container}>
          <CustomCheckBox checked={data.resumeAds} onClick={e => onHandleChange(e, "resumeAds")}>
            Возобновлять объявление
            <br />
            после завершения аренды
          </CustomCheckBox>
        </div>
        <Button onClick={handleRedirect} text="Далее"/>
        {hourModalOpen && (
          <Modal 
            setOpenModal={setHourModalOpen}
            openModal={hourModalOpen}
            title="Изменить цену за час"
          >
            <>
              <PriceCounterBlock
                price={data.hourPrice}
                setPrice={e => onHandleChange(e, "hourPrice")}
                currency
              />
              <Button onClick={() => setHourModalOpen(false)} text="Готово"/>
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
                price={data.dayPrice}
                setPrice={e => onHandleChange(e, "dayPrice")}
                currency
                step={100}
              />
              <Button onClick={() => setDayModalOpen(false)} text="Готово"/>
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
                price={data.weekPrice}
                setPrice={e => onHandleChange(e, "weekPrice")}
                currency
                step={500}
              />
              <Button onClick={() => setWeekModalOpen(false)} text="Готово"/>
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
                price={data.monthPrice}
                setPrice={e => onHandleChange(e, "monthPrice")}
                currency
                step={1000}
              />
              <Button onClick={() => setMonthModalOpen(false)} text="Готово"/>
            </>
          </Modal>
        )}
        {openStartTimeModal && (
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
        )}
			</Container>
		</>
	)
};

export default ExtraOptions;
