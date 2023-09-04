import styles from "./CustomCheckbox.module.css";

const CustomCheckBox = ({ children, checked, onClick }) => {
	return (
		<div className={styles.checkbox_wrapper}>
			<span onClick={() => onClick(!checked)} className={`${checked ? styles.checked : styles.not_checked}`}>
				<img src="/src/assets/check-icon.svg" alt="checked"/>
			</span>
			{children && <p className={styles.label}>{children}</p>}
		</div>
	)
}

export default CustomCheckBox;