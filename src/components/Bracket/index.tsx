import Link from "next/link";
import { colors } from "../../constants/colors";
import Navbar from "../Navbar";
import { Logo } from "../Navbar/Logo";
import Wallet from "../Navbar/Wallet";
import Button from "../UI/Button";
import Content from "../UI/Content";
import Divider from "../UI/Divider";
import MainWrapper from "../UI/MainWrapper";
import BracketCreate from "./Create";
import BracketView from "./View";
import styles from "./BracketWrapper.module.css";
import BracketDescription from "./Description";
import BracketInfo from "./Navbar/Info";

const BracketWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <div className={styles.container}>
          <Logo src="/assets/banny-visible.svg" />
          <BracketInfo />
          <div className={styles.buttonContainer}>
            <Wallet />
            <Link href="/">
              <Button color={colors.pink}>GO BACK</Button>
            </Link>
          </div>
        </div>
      </Navbar>
      <BracketDescription />
      <Divider />
      <Content title="BRACKET">
        <BracketView />
      </Content>
    </MainWrapper>
  );
};

export default BracketWrapper;
