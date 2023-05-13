import Navbar from "../Navbar";
import { Logo } from "../Navbar/Logo";
import Wallet from "../Navbar/Wallet";
import MainWrapper from "../UI/MainWrapper";
import DeployerCreate from "./Create";
import styles from "./DeployerWrapper.module.css";
import DeployerDescription from "./Description";
import Farcaster from "./Navbar/Farcaster";
import DeployerInfo from "./Navbar/Info";

const DeployerWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <div className={styles.container}>
          <Logo src="/assets/banny-visible.svg" />
          <DeployerInfo />
          <div className={styles.buttonContainer}>
            <Wallet />
            <Farcaster />
          </div>
        </div>
      </Navbar>
      <DeployerDescription />
      <DeployerCreate />
    </MainWrapper>
  );
};

export default DeployerWrapper;
