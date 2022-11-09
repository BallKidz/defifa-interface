import { Logo } from "../Logo";
import Wallet from "../Wallet";
import styles from "./Info.module.css";
const Info = () => {
  return (
    <div className={styles.container}>
      <Logo src="/assets/defifa.svg" />
      <Wallet />
    </div>
  );
};

export default Info;
