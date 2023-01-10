import Button from "../../UI/Button";
import { Logo } from "../Logo";
import Wallet from "../Wallet";
import CurrentPhase from "./CurrentPhase";
import styles from "./Info.module.css";
import Treasury from "./Treasury";
const Info = () => {
  const handleRedirect = () => {
    window.open("https://wc2022.defifa.net");
  };

  return (
    <div className={styles.container}>
      <Logo src="/assets/defifa-nfl-logo.png" />
      <Treasury />
      <CurrentPhase />
      <div className={styles.buttonContainer} style={{ marginLeft: "auto" }}>
        <Wallet />
        <Button onClick={handleRedirect}>Defifa WC 2022</Button>
      </div>
    </div>
  );
};

export default Info;
