import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Toggle from "react-styled-toggle";
import styles from "./ExtraOptions.module.css";
import { Checkbox } from "antd";
import { Button, Modal } from "antd";
import Container from "../common/Container";

const ExtraOptions = () => {
  const [hoursCount, setHoursCount] = useState(350);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameVisible, setNameVisible] = useState(false);

  const increment = () => {
    setHoursCount((prevHours) => prevHours + 10);
  };

  const decrement = () => {
    if (hoursCount > 0) {
      setHoursCount((prevHours) => prevHours - 10);
    }
  };

  const showModal2 = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [activeButton, setActiveButton] = React.useState(null);
  const [activeMapButton, setActiveMapButton] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [startingHour, setStartingHour] = useState("00");
  const [startingMinute, setStartingMinute] = useState("00");
  const [endingHour, setEndingHour] = useState("00");
  const [endingMinute, setEndingMinute] = useState("00");


  const [tempHour, setTempHour] = useState("00");
  const [tempMinute, setTempMinute] = useState("00");
  const [hourModalOpen, setHourModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const [daysCount, setDaysCount] = useState(0); // Добавьте это
  const [weeksCount, setWeeksCount] = useState(0); // Добавьте это
  const [monthsCount, setMonthsCount] = useState(0);
  const [modalIdentifier, setModalIdentifier] = useState(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null); 
  
  const [activeParking, setActiveParking] = useState('');
  const [activeSecurity, setActiveSecurity] = useState(false);
  const [activeHeating, setActiveHeating] = useState(false)
  const [active220V, setActive220V] = useState(false)
  const [activeElectricCar, setActiveElectricCar] = useState(false)
  const [activeNotStandardCar, setActiveNotStandardCar] = useState(false)

  const navigate = useNavigate();

  const closeModal = () => {
    setShowModal(false);
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const dateRef = useRef(null);
  useEffect(() => {
    if (showModal) {
      const hourElement = hourRef.current.querySelector(`.${styles.selected}`);
      if (hourElement)
        hourElement.scrollIntoView({ behavior: "smooth", block: "center" });

      const minuteElement = minuteRef.current.querySelector(
        `.${styles.selected}`
      );
      if (minuteElement)
        minuteElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showModal, tempHour, tempMinute]);
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  // Отфильтрованный массив часов на основе текущего времени
  const filteredHoursArray = hoursArray.filter(
    (hour) => parseInt(hour, 10) >= currentHour
  );

  // Отфильтрованный массив минут на основе текущего времени и выбранного часа
  const getFilteredMinutesArray = (selectedHour) => {
    if (parseInt(selectedHour, 10) === currentHour) {
      return ["00", "15", "30", "45"].filter(
        (minute) => parseInt(minute, 10) >= currentMinute
      );
    }
    return ["00", "15", "30", "45"];
  };
  const incrementHours = () => {
    setHoursCount((prevHours) => prevHours + 100);
  };

  const decrementHours = () => {
    if (hoursCount > 0) {
      setDaysCount((prevHours) => prevHours - 100);
    }
  };
  const incrementDays = () => {
    setDaysCount((prevDays) => prevDays + 100);
  };

  const decrementDays = () => {
    if (daysCount > 0) {
      setDaysCount((prevDays) => prevDays - 100);
    }
  };

  const incrementWeeks = () => {
    setWeeksCount((prevWeeks) => prevWeeks + 500);
  };

  const decrementWeeks = () => {
    if (weeksCount > 0) {
      setWeeksCount((prevWeeks) => prevWeeks - 500);
    }
  };

  const incrementMonths = () => {
    setMonthsCount((prevMonths) => prevMonths + 1000);
  };

  const decrementMonths = () => {
    if (monthsCount > 0) {
      setMonthsCount((prevMonths) => prevMonths - 1000);
    }
  };
  const handleRedirect = () => {
    const data = {
      selectedHour,
      selectedMinute,
      hoursCount,
      daysCount,
      weeksCount,
      monthsCount,
      activeParking,
      activeHeating,
      activeSecurity,
      activeElectricCar,
      active220V,
      activeNotStandardCar,
      startingHour,
      startingMinute,
      endingHour,
      endingMinute,
    };
    navigate("/review", { state: data });
  };
  const openModal = (identifier) => {
    if (identifier === "starting") {
      setShowModal(true);
      setModalIdentifier("starting");
    } else if (identifier === "ending") {
      setShowModal(true);
      setModalIdentifier("ending");
    }
  };

  return (
		<div>
			<NavBar/>
			<Container>
				<div>
					{showModal && modalIdentifier === "starting" && (
						<div
							className={styles.modalOverlay}
							onClick={() => setShowModal(false)}
						>
							<div className={styles.modal} onClick={e => e.stopPropagation()}>
								<div className={styles.timeSelector}>
									<div className={styles.hour} ref={hourRef}>
										{filteredHoursArray.map((hour, index) => (
											<div
												key={index}
												onClick={() => {
													setTempHour(hour)
													setTempMinute("00") // Сбросьте минуты при смене часа
												}}
												className={`${styles.time} ${
													tempHour === hour && styles.selected
												}`}
											>
												{hour}
											</div>
										))}
									</div>

									<div className={styles.minute} ref={minuteRef}>
										{getFilteredMinutesArray(tempHour).map((minute, index) => (
											<div
												key={index}
												onClick={() => setTempMinute(minute)}
												className={`${styles.time} ${
													tempMinute === minute && styles.selected
												}`}
											>
												{minute}
											</div>
										))}
									</div>
								</div>
								<div className={styles.btnWrapper}>
									<button className={styles.buttonConfirm} onClick={closeModal}>
										Отмена
									</button>
									<button
										onClick={() => {
											setStartingHour(tempHour)
											setStartingMinute(tempMinute)
											setShowModal(false)
										}}
										className={styles.buttonConfirm}
									>
										Готово
									</button>
								</div>
							</div>
						</div>
					)}

					{showModal && modalIdentifier === "ending" && (
						<div
							className={styles.modalOverlay}
							onClick={() => setShowModal(false)}
						>
							<div className={styles.modal} onClick={e => e.stopPropagation()}>
								<div className={styles.timeSelector}>
									<div className={styles.hour} ref={hourRef}>
										{filteredHoursArray.map((hour, index) => (
											<div
												key={index}
												onClick={() => {
													setTempHour(hour)
													setTempMinute("00") // Сбросьте минуты при смене часа
												}}
												className={`${styles.time} ${
													tempHour === hour && styles.selected
												}`}
											>
												{hour}
											</div>
										))}
									</div>

									<div className={styles.minute} ref={minuteRef}>
										{getFilteredMinutesArray(tempHour).map((minute, index) => (
											<div
												key={index}
												onClick={() => setTempMinute(minute)}
												className={`${styles.time} ${
													tempMinute === minute && styles.selected
												}`}
											>
												{minute}
											</div>
										))}
									</div>
								</div>
								<div className={styles.btnWrapper}>
									<button className={styles.buttonConfirm} onClick={closeModal}>
										Отмена
									</button>
									<button
										onClick={() => {
											setEndingHour(tempHour)
											setEndingMinute(tempMinute)
											setShowModal(false)
										}}
										className={styles.buttonConfirm}
									>
										Готово
									</button>
								</div>
							</div>
						</div>
					)}

					<p className={styles.size_main_text}>Могу сдать в период:</p>
					<div className={styles.parent_container_1}>
						<div className={styles.size_wrapper_1}>
							<p className={styles.header_text}>Начиная с</p>
							<p
								onClick={() => openModal("starting")}
								className={styles.parametr}
							>
								{startingHour}:{startingMinute}
							</p>
						</div>
						<div></div>
						<div className={styles.size_wrapper_1}>
							<p className={styles.header_text}>По</p>
							<p
								onClick={() => openModal("ending")}
								className={styles.parametr}
							>
								{endingHour}:{endingMinute}
							</p>
						</div>
					</div>
				</div>
				<div className={styles.container}>
					<div className={styles.boxContainer}>
						<p className={styles.main_text}>Тип парковки</p>
						<label>
							<input
								type="radio"
								name="parkingType"
								value="Подземная"
								onChange={() => setActiveParking("Подземная")}
							/>{" "}
							Подземная
						</label>
						<label>
							<input
								type="radio"
								name="parkingType"
								value="Открытая"
								onChange={() => setActiveParking("Открытая")}
							/>{" "}
							Открытая
						</label>
						<label>
							<input
								type="radio"
								name="parkingType"
								value="Крытая"
								onChange={() => setActiveParking("Крытая")}
							/>{" "}
							Крытая
						</label>
						<label>
							<input
								type="radio"
								name="parkingType"
								value="Гараж"
								onChange={() => setActiveParking("Гараж")}
							/>{" "}
							Гараж
						</label>
					</div>

					<div className={styles.toggleContainer}>
						<p className={styles.main_text}>Доп. опции</p>
						<label>
							<div className={styles.toggleWrapper}>
								<Toggle onChange={() => setActiveSecurity(!activeSecurity)} />
							</div>
							Охрана
						</label>
						<label>
							<div className={styles.toggleWrapper}>
								<Toggle onChange={() => setActiveHeating(!activeHeating)} />
							</div>
							Обогрев
						</label>
					</div>
				</div>
				<div className={styles.elektro_wrapper}>
					<p className={styles.size_main_text}>Для электромобилей</p>
					<div>
						<label>
							<div className={styles.toggleWrapper}>
								<div className={styles.third_style}>
									<Checkbox
										style={{
											borderRadius: "50%",
											fontSize: "20px",
											alignItems: "center",
											marginTop: "10%",
											fontWeight: "300",
											width: "120%",
											height: "120%",
										}}
										onChange={() => setActive220V(!active220V)}
									>
										220V
									</Checkbox>
									<Checkbox
										style={{
											borderRadius: "50%",
											fontSize: "20px",
											alignItems: "center",
											marginTop: "10%",
											fontWeight: "300",
											width: "120%",
											height: "120%",
										}}
										onChange={() => setActiveElectricCar(!activeElectricCar)}
									>
										Электромобиль
									</Checkbox>
								</div>
							</div>
						</label>
					</div>
					<label>
						<div className={styles.toggleWrapper}>
							<Toggle
								onChange={() => setActiveNotStandardCar(!activeNotStandardCar)}
							/>
						</div>
						Нестандартные размеры авто
					</label>
				</div>
				<div>
					<p className={styles.size_main_text}>Цены</p>
					<div className={styles.cooc}>
						<div className={styles.container}>
							<div className={styles.boxContainer}>
								<div className={styles.parent_container_1}>
									<div className={styles.size_wrapper_1}>
										<p className={styles.header_text}>Цена за час</p>
										<p
											onClick={() => setHourModalOpen(true)}
											className={styles.parametr}
										>
											{hoursCount} руб
										</p>
									</div>
									<div className={styles.size_wrapper_1}>
										<p className={styles.header_text}>Цена за день</p>
										<p
											onClick={() => setDayModalOpen(true)}
											className={styles.parametr}
										>
											{daysCount} руб
										</p>
									</div>
								</div>
							</div>
							<div className={styles.container1}>
								<div className={styles.boxContainer}>
									<div className={styles.parent_container_1}>
										<div className={styles.size_wrapper_1}>
											<p className={styles.header_text}>Цена за неделю</p>
											<p
												onClick={() => setWeekModalOpen(true)}
												className={styles.parametr}
											>
												{weeksCount} руб
											</p>
										</div>
										<div>
											<div className={styles.size_wrapper_2}>
												<p className={styles.header_text}>Цена за месяц</p>
												<p
													onClick={() => setMonthModalOpen(true)}
													className={styles.parametr}
												>
													{monthsCount} руб
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* */}
					<Modal
						title="Изменить цену за час"
						visible={hourModalOpen}
						onCancel={() => setHourModalOpen(false)}
						footer={[
							<button
								key="cancel"
								onClick={() => setHourModalOpen(false)}
								className={styles.buttonConfirm}
							>
								Отмена
							</button>,
							<button
								key="ok"
								onClick={() => {
									setHourModalOpen(false)
									setHoursCount(tempHoursCount)
								}}
								className={styles.buttonConfirm}
							>
								Готово
							</button>,
						]}
					>
						<div className={styles.incrementWrapper}>
							<p
								onClick={decrementHours}
								className={styles.incrementWithBorderMinus}
							>
								{" "}
								-{" "}
							</p>
							<p>{hoursCount} руб</p>
							<p
								className={styles.incrementWithBorderPlus}
								onClick={incrementHours}
							>
								{" "}
								+{" "}
							</p>
						</div>
					</Modal>
					<Modal
						title="Изменить цену за день"
						visible={dayModalOpen}
						onCancel={() => setDayModalOpen(false)}
						footer={[
							<button
								key="cancel"
								onClick={() => setDayModalOpen(false)}
								className={styles.buttonConfirm}
							>
								Отмена
							</button>,
							<button
								key="ok"
								onClick={() => {
									setDayModalOpen(false)
									setDaysCount(tempDaysCount)
								}}
								className={styles.buttonConfirm}
							>
								Готово
							</button>,
						]}
					>
						<div className={styles.incrementWrapper}>
							<p
								onClick={decrementDays}
								className={styles.incrementWithBorderMinus}
							>
								{" "}
								-{" "}
							</p>
							<p>{daysCount} руб</p>
							<p
								className={styles.incrementWithBorderPlus}
								onClick={incrementDays}
							>
								{" "}
								+{" "}
							</p>
						</div>
					</Modal>

					{/* Модальное окно для цены за неделю */}
					<Modal
						title="Изменить цену за неделю"
						visible={weekModalOpen}
						onCancel={() => setWeekModalOpen(false)}
						footer={[
							<button
								key="cancel"
								onClick={() => setWeekModalOpen(false)}
								className={styles.buttonConfirm}
							>
								Отмена
							</button>,
							<button
								key="ok"
								onClick={() => {
									setWeekModalOpen(false)
									setWeeksCount(tempWeeksCount)
								}}
								className={styles.buttonConfirm}
							>
								Готово
							</button>,
						]}
					>
						<div className={styles.incrementWrapper}>
							<p
								onClick={decrementWeeks}
								className={styles.incrementWithBorderMinus}
							>
								{" "}
								-{" "}
							</p>
							<p>{weeksCount} руб</p>
							<p
								className={styles.incrementWithBorderPlus}
								onClick={incrementWeeks}
							>
								{" "}
								+{" "}
							</p>
						</div>
					</Modal>

					{/* Модальное окно для цены за месяц */}
					<Modal
						title="Изменить цену за месяц"
						visible={monthModalOpen}
						onCancel={() => setMonthModalOpen(false)}
						footer={[
							<button
								key="cancel"
								onClick={() => setMonthModalOpen(false)}
								className={styles.buttonConfirm}
							>
								Отмена
							</button>,
							<button
								key="ok"
								onClick={() => {
									setMonthModalOpen(false)
									setMonthsCount(tempMonthsCount)
								}}
								className={styles.buttonConfirm}
							>
								Готово
							</button>,
						]}
					>
						<div className={styles.incrementWrapper}>
							<p
								onClick={decrementMonths}
								className={styles.incrementWithBorderMinus}
							>
								{" "}
								-{" "}
							</p>
							<p>{monthsCount} руб</p>
							<p
								className={styles.incrementWithBorderPlus}
								onClick={incrementMonths}
							>
								{" "}
								+{" "}
							</p>
						</div>
					</Modal>

					<Checkbox
						style={{
							borderRadius: "50%",
							fontSize: "15px",
							alignItems: "center",
							marginTop: "10%",
							fontWeight: "350",
							width: "120%",
							height: "120%",
						}}
						onChange={() => setNameVisible(!isNameVisible)}
					>
						Возобновлять объявление
						<br />
						после завершения аренды
					</Checkbox>
					<button onClick={handleRedirect} className={styles.submit}>
						Далее
					</button>
				</div>
			</Container>
		</div>
	)
};

export default ExtraOptions;
