import { useState } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

import NavBar from 'src/components/NavBar'
import Container from 'src/components/common/Container'
import ZeroData from 'src/components/common/ZeroData'
import styles from './FAQ.module.css'
const Faq = () => {
	const [activeQuestion, setActiveQuestion] = useState(null)
	const [faqData] = useState([
		{
			question:
				'Можно ли пользоваться сервисом с компьютера, без использования telegram?',
			answer:
				'Конечно! Заходи по адресу <a href="https://app.parkangel.ru" target="_blank">app.parkangel.ru</a>. Понадобится telegram ник. Подсказка где его найти – на первой страничке сайта. Интерфейс такой же что и в telegram.',
		},
		{
			question: 'Вы гарантируете порядочность арендодателя или арендатора?',
			answer:
				'Мы – своеобразный tinder для автовладельцев: просто знакомим заинтересованные стороны. Поэтому ответственности за порядочность пользователей нести не можем. Но мы верим в хороших людей ) И всегда можно оставить рейтинг или отзыв на то что понравилось или не понравилось.',
		},
		{
			question: 'Зачем нужно регистрироваться в личном кабинете?',
			answer:
				'Что бы не вводить каждый раз свои контактные данные при размещении объявления. Мы не обрабатываем и никому не передаём личную информацию пользователей',
		},
		{
			question: 'Могу ли я отредактировать или удалить свои объявления?',
			answer:
				'Конечно. Для этого на первой странице нужно нажать на карандашик или корзинку соответственно',
		},
		{
			question: 'Как можно рассказать о сервисе друзьям?',
			answer:
				'Можно отправить ссылку на наш сайт parkangel.ru или на tg бот @park_angel_bot или на веб версию <a href="https://app.parkangel.ru" target="_blank">app.parkangel.ru</a>',
		},
		{
			question: 'В каких городах работает сервис?',
			answer:
				'Сейчас в Москве, Питере и пригородах. Постепенно добавим другие крупные города.',
		},
	])

	return (
		<>
			<NavBar />
			<Container>
				<h2 className={styles.faq}>Частые вопросы</h2>
				{faqData.length ? (
					<>
						{faqData.map((item, index) => (
							<div
								key={index}
								className={styles.wrapper_question}
								onClick={() =>
									setActiveQuestion(activeQuestion === index ? null : index)
								}
							>
								<div className={styles.text_with_icon}>
									<p className={styles.questions}>{item.question}</p>
									{activeQuestion === index ? (
										<BiChevronUp className={styles.down_img} />
									) : (
										<BiChevronDown className={styles.down_img} />
									)}
								</div>
								<div
									className={`${styles.answer} ${
										activeQuestion === index ? styles.open : ''
									}`}
									dangerouslySetInnerHTML={{ __html: item.answer }} // Добавлено для рендеринга HTML
								></div>
							</div>
						))}
					</>
				) : (
					<ZeroData>Вопросов нет</ZeroData>
				)}
			</Container>
		</>
	)
}

export default Faq
