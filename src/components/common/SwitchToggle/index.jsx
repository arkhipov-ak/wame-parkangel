import styles from "./SwitchToggle.module.css";

export default function SwitchToggle({ active, onClick }) {
	return (
		<div
			className={`${active ? styles.active_toggle : styles.not_active_toggle}`}
			onClick={() => onClick(!active)}
		>
			<span className={`${active ? styles.active_round : styles.not_active_round}`}/>
		</div>
	)
}