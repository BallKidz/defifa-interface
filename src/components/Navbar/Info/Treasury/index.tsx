import { colors } from "../../../../constants/colors";
import styles from "./Treasury.module.css";

const Treasury = () => {
  return (
    <div className={styles.container}>
      <h1 style={{ color: colors.turquoise }}>
        0 eth
        <span> from</span>
        <span> 0 players</span>
      </h1>

      <p style={{ color: colors.purple }}>current game treasury</p>
    </div>
  );
};

export default Treasury;
