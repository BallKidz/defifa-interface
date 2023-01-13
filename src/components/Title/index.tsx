import { FC } from "react";
import styles from "./Title.module.css";

interface TitleProps {
  title: string;
}

const Title: FC<TitleProps> = ({ title }) => {
  return <h1 className={styles.title}>{title}</h1>;
};

export default Title;
