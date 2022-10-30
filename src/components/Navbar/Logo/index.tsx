/* eslint-disable @next/next/no-img-element */
import styles from "./Logo.module.css";
const Logo = () => {
  return (
    <div className={styles.container}>
      <img src="/assets/defifa.svg" alt="Defifa" width={200} />
    </div>
  );
};

export default Logo;
