import { Logo } from "../Logo";
import Wallet from "../Wallet";
import CurrentPhase from "./CurrentPhase";
import styles from "./Info.module.css";
import Treasury from "./Treasury";
const Info = () => {
  return (
    <div className={styles.container}>
      <Logo src="/assets/defifa.svg" />
      <Treasury />
      <CurrentPhase />
      <Wallet />
    </div>
  );
};

export default Info;
