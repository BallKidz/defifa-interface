import Link from "next/link";
import { colors } from "../../constants/colors";
import Navbar from "../Navbar";
import { Logo } from "../Navbar/Logo";
import Wallet from "../Navbar/Wallet";
import Button from "../UI/Button";
import Content from "../UI/Content";
import Divider from "../UI/Divider";
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
            <Wallet />
            <Link href="/">
              <Button color={colors.pink}>GO BACK</Button>
            </Link>
          </div>
        </div>
      </Navbar>
      <DeployerDescription />
      <Divider />
      <Content title="CREATE">
        <DeployerCreate />
      </Content>
    </MainWrapper>
  );
};

export default DeployerWrapper;
