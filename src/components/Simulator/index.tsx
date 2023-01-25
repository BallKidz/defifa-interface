import Link from "next/link";
import { colors } from "../../constants/colors";
import Navbar from "../Navbar";
import { Logo } from "../Navbar/Logo";
import Wallet from "../Navbar/Wallet";
import Button from "../UI/Button";
import Content from "../UI/Content";
import Divider from "../UI/Divider";
import MainWrapper from "../UI/MainWrapper";
import SimulatorCreate from "./Simulate";
import styles from "./SimulatorWrapper.module.css";
import SimulatorDescription from "./Description";
import SimulatorInfo from "./Navbar/Info";

const SimulatorWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <div className={styles.container}>
          <Logo src="/assets/banny-visible.svg" />
          <SimulatorInfo />
          <div className={styles.buttonContainer}>
            <Wallet />
            <Link href="/">
              <Button color={colors.pink}>GO BACK</Button>
            </Link>
          </div>
        </div>
      </Navbar>
      <SimulatorDescription />
      <Divider />
      <Content title="SCORECARD">
        <SimulatorCreate />
      </Content>
    </MainWrapper>
  );
};

export default SimulatorWrapper;
