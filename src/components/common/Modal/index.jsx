import { useEffect } from "react";

import styles from "./Modal.module.css";
import CloseButton from "src/components/common/CloseButton";

const Modal = ({
	children,
	setOpenModal,
	openModal,
	title = null,
	closeButton = true,
  marginTop = "20px"
}) => {
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "Escape") setOpenModal(false)
		};

		document.addEventListener("keydown", handleKeyPress);
		
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [setOpenModal]);

	return (
		openModal && (
			<div className={styles.wrapper}>
				<div className={styles.modal}>
					<div className={styles.modal_heading}>
						{title && <p className={styles.modal_title}>{title}</p>}
						{closeButton && <CloseButton onClick={() => setOpenModal(false)} />}
					</div>
					<div className={styles.modal_content} style={{ marginTop: marginTop }}>
						{children}
					</div>
				</div>
				<div className={styles.overlay} onClick={() => setOpenModal(false)}/>
			</div>
		)
	);
};

export default Modal;