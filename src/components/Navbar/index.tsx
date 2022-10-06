import Info from "./Info";
import Logo from "./Logo";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Logo />
      <Info />
    </div>
  );
};

export default Navbar;
