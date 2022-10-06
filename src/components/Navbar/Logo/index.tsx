import Image from "next/image";
import styles from "./Logo.module.css";
const Logo = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/assets/defifa.svg"
        width="389px"
        height="322px"
        alt="Defifa"
      />
    </div>
  );
};

export default Logo;
