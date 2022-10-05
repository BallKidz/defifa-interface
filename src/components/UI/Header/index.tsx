import styles from "./Header.module.css";

const Header = ({ children }: { children: JSX.Element }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Header;
