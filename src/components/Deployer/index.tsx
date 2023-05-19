import Link from "next/link";
import Navbar from "../Navbar";
import { Logo } from "../Navbar/Logo";
import Wallet from "../Navbar/Wallet";
import Button from "../UI/Button";
import MainWrapper from "../UI/MainWrapper";
import DeployerCreate from "./Create";
import styles from "./DeployerWrapper.module.css";
import DeployerDescription from "./Description";
import DeployerInfo from "./Navbar/Info";

const DeployerWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <div className={styles.container}>
          <Logo src="/assets/banny-visible.svg" />
          <DeployerInfo />
          <div className={styles.buttonContainer}>
            <Link href="/">
              <div>
                <Button>Back</Button>
              </div>
            </Link>
            <Wallet />
          </div>
        </div>
      </Navbar>
      <DeployerDescription />
      <DeployerCreate />
    </MainWrapper>
  );
};

export default DeployerWrapper;
