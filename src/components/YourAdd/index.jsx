import { useState } from "react"
import { Modal } from "antd"
import { Rate } from "antd"
import NavBar from "../NavBar"
import { YMaps, Map } from "@pbe/react-yandex-maps"
import axios from "axios"
import styles from "./YourAdd.module.css"
import { Link } from "react-router-dom"

const YourAdd = () => {
	const API_KEY = "cfb7ca98-9e16-49b6-9147-4daad6d34284";

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [rating, setRating] = useState(2.5);
	const [comment, setComment] = useState("");
	const showModal = () => {
		setIsModalOpen(true)
	}
	const handleOk = () => {
		setIsModalOpen(false)
	}
	const handleCancel = () => {
		setIsModalOpen(false)
	}
	const handleOkBtn = () => {
		axios
			.post("/api/review", { rating, message: comment, ad_id, user_id })
			.then(response => {
				setIsModalOpen(false)
			})
			.catch(error => {
				console.error("Error submitting review:", error)
			})
	}
	return (
		<div>
			<NavBar />
			<div className={styles.container}>
				<div>
					<p className={styles.review_text}>Выбранное объявление</p>
					<div className={styles.wrapper_div}>
						<p className={styles.main_text}>Москва, Моховая улица, 15/1с1</p>
						<div className={styles.styles_container}>
							<div className={styles.styles_left}>
								<div>
									<p>Тип паркинга</p>
									<p>Охрана</p>
									<p>Обогрев</p>
									<p>Для электромобилей</p>
									<p>Время доступности</p>
									<p>Стоимость в час</p>
									<p>Стоимость в день</p>
									<p>Стоимость в неделю</p>
									<p>Стоимость в месяц</p>
									<p>Имя</p>
									<p>Номер телефона</p>
									<p>Telegram</p>
								</div>
							</div>
							<div className={styles.styles_right}>
								<p>Подземная</p>
								<p>Да</p>
								<p>Нет</p>
								<p>220V</p>
								<p>12:00-16:00</p>
								<p>450 руб</p>
								<p>1000 руб</p>
								<p>3000 руб</p>
								<p>7000 руб</p>
								<p>Виктор</p>
								<p>+78006007775</p>
								<p>@MyName</p>
							</div>
						</div>
						<YMaps apiKey={API_KEY}>
							<Map
								width="100%"
								height="30vh"
								defaultState={{
									center: [55.7558, 37.6173], // Координаты Москвы
									zoom: 16,
									type: "yandex#map",
								}}
								options={{
									suppressMapOpenBlock: true, // Убирает блок "Открыть в Яндекс.Картах"
									suppressYandexSearch: true,
								}}
							></Map>
						</YMaps>
					</div>
					<Link className={styles.next}>Позвонить</Link>
					<Link className={styles.write}>Написать в Telegram</Link>
					<Link onClick={showModal} className={styles.return}>
						Оставить отзыв
					</Link>
					<Modal open={isModalOpen} footer={null} onCancel={handleCancel}>
						<div>
							<p className={styles.descr}>Как все прошло?</p>
							<div className="rateContainer">
								<Rate
									allowHalf
									value={rating}
									onChange={value => setRating(value)}
									style={{ fontSize: "2.5rem" }}
								/>
							</div>
							<p className={styles.descr}>Ваш отзыв</p>
							<input
								className={styles.input_style}
								placeholder="Опишите ваш опыт"
								type="text"
								value={comment}
								onChange={e => setComment(e.target.value)}
							/>
							<button onClick={handleOkbtn} className={styles.submit}>
								Отправить
							</button>
						</div>
					</Modal>
				</div>
			</div>
		</div>
	)
}

export default YourAdd
