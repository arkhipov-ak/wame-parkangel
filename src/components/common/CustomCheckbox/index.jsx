import styles from "./CustomCheckbox.module.css";
import checkIcon from "/src/assets/check-icon.svg";

const CustomCheckBox = ({ children, checked, onClick }) => {
	return (
		<div className={styles.checkbox_wrapper}>
			<span onClick={() => onClick(!checked)} className={`${checked ? styles.checked : styles.not_checked}`}>
				<img src={checkIcon} alt="checked"/>
			</span>
			{children && <p className={styles.label}>{children}</p>}
		</div>
	)
}

export default CustomCheckBox;