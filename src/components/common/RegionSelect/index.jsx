import styles from "./RegionSelect.module.css";

const RegionSelect = ({ activeRegion, setActiveRegion }) => {
  return (
    <select
        value={activeRegion}
        onChange={(e) => setActiveRegion(e.target.value)}
        className={styles.region_select}
    >
        <option value="moscow">Москва и область</option>
        <option value="spb">СПб и область</option>
    </select>
  )
}

export default RegionSelect;