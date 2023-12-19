import styles from "./ModalDeleteAd.module.css";
import Modal from "src/components/common/Modal";

const ModalDeleteAd = ({ ad, onHandleDeleteClick, openDeleteModal, setOpenDeleteModal }) => {
  return (
    <Modal
      setOpenModal={setOpenDeleteModal}
      openModal={openDeleteModal}
      title="Удалить объявление?"
    >
      <div className={styles.btnWrapper}>
        <button type="button" className={styles.modal_button} onClick={() => setOpenDeleteModal(false)}>
          Нет
        </button>
        <button type="button" onClick={() => onHandleDeleteClick(ad)} className={styles.modal_button}>
          Да
        </button>
      </div>
    </Modal>
  )
}

export default ModalDeleteAd;
