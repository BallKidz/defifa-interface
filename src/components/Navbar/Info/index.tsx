import { Logo } from "../Logo";
import Wallet from "../Wallet";
import styles from "./Info.module.css";
import Socials from "./Socials";
const Info = () => {
  const handleRedirect = () => {
    window.open("https://wc2022.defifa.net");
  };

  return (
    <div className={styles.container}>
      <Logo src="/assets/defifa.svg" />
      <Socials />

      <div className={styles.buttonContainer} style={{ marginLeft: "auto" }}>
        <Wallet />
      </div>
    </div>
  );
};

export default Info;
