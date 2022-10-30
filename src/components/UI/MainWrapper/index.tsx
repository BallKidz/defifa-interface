import { PropsWithChildren } from "react";
import styles from "./MainWrapper.module.css";

const MainWrapper = (props: PropsWithChildren) => {
  return <div className={styles.container}>{props.children}</div>;
};

export default MainWrapper;
