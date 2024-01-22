import styles from "./ModalReviews.module.css";
import Modal from "src/components/common/Modal";

const ModalReviews = ({ reviews, totalRating, openReviewsModal, setOpenReviewsModal }) => {
  return (
    <Modal
      setOpenModal={setOpenReviewsModal}
      openModal={openReviewsModal}
      title="Отзывы"
    >
      <span className={styles.total_rating}>Общий рейтинг: <i>{totalRating} / 5 ({reviews.length})</i></span>
      <ul className={styles.reviews_list}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.reviews_list_item}>
            <span className={styles.info_text}>Сообщение: <i>{review.message}</i></span>
            <span className={styles.info_text}>Оценка: <i>{review.rating} / 5</i></span>
          </li>
        ))}
      </ul>
      
    </Modal>
  )
}

export default ModalReviews;
