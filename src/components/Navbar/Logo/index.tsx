/* eslint-disable @next/next/no-img-element */
import styles from "./Logo.module.css";
const Logo = ({ isVisible = true }: { isVisible?: boolean }) => {
  return (
    <div
      className={styles.container}
      style={{ display: isVisible ? "block" : "none" }}
    >
      <img src="/assets/defifa.svg" alt="Defifa" />
    </div>
  );
};

export default Logo;
