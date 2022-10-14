import Image from "next/image";
import styles from "./SortSelect.module.css";

const SortSelect = () => {
  return (
    <div className={styles.sortSelect}>
      <label htmlFor="sort">SORT BY:</label>
      <div className={styles.selectWrapper}>
        <select name="sort" id="sort">
          <option value="group">GROUP</option>
          <option value="minted">MOST MINTED</option>
        </select>
        <div className={styles.arrow}>
          <Image src="/assets/chevron-down.svg" alt="" width="100%" height="100%"/>
        </div>
      </div>
    </div>
  );
};

export default SortSelect;
