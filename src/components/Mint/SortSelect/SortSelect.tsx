import Image from "next/image";
import { FC, useState } from "react";
import styles from "./SortSelect.module.css";

interface SortSelectProps {
  onChange?: (value: string) => void;
}

const SortSelect: FC<SortSelectProps> = ({ onChange }) => {
  const [sortOption, setSortOption] = useState<string>("group");

  const onSortOptionChange = (value: string) => {
    onChange?.(value);
    setSortOption(value);
  };

  return (
    <div className={styles.sortSelect}>
      <label htmlFor="sort">Sort by:</label>
      <div className={styles.selectWrapper}>
        <select
          name="sort"
          id="sort"
          onChange={(e) => onSortOptionChange(e.target.value)}
          defaultValue={sortOption}
        >
          <option value="group" className={styles.option}>
            GROUP
          </option>
          <option value="minted" className={styles.option}>
            MOST MINTED
          </option>
        </select>
        <div className={styles.arrow}>
          <Image
            src="/assets/chevron-down.svg"
            alt="Chevron"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default SortSelect;
