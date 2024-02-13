import ReactPlayer from "react-player";

import styles from "./ModalVideo.module.css";
import Modal from "src/components/common/Modal";

const ModalVideo = ({ videoUrl, title, openVideoModal, setOpenVideoModal }) => {
  return (
    <Modal
      setOpenModal={setOpenVideoModal}
      openModal={openVideoModal}
      title={title}
    >
      <div className={styles.player_wrapper}>
        <ReactPlayer
          controls
          playing
          url={videoUrl}
          width={200}
        />
      </div>
    </Modal>
  )
}

export default ModalVideo;
