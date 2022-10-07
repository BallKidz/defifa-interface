import Wallet from "../Wallet";
import CurrentPhase from "./CurrentPhase";
import styles from "./Info.module.css";
import Discord from "./Socials/Discord";
import Treasury from "./Treasury";
const Info = () => {
  return (
    <div className={styles.container}>
      <Wallet />
      <Treasury />
      <CurrentPhase />
      <Discord />
    </div>
  );
};

export default Info;
