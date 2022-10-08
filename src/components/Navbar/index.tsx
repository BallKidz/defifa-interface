import { useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Info from "./Info";
import Logo from "./Logo";
import styles from "./Navbar.module.css";
import Wallet from "./Wallet";

const Navbar = () => {
  const { width } = useWindowDimensions();
  const [isTabletOrMobile, setIsTabletorMobile] = useState<boolean>(false);

  useEffect(() => {
    if (width <= 1024) {
      setIsTabletorMobile(true);
      return;
    }
    setIsTabletorMobile(false);
  }, [width]);

  return (
    <div className={styles.container}>
      <div className={styles.logoWalletContainer}>
        <Logo isVisible={isTabletOrMobile} />
        <Wallet />
      </div>

      <div
        className={styles.logoInfoContainer}
        style={{ marginTop: isTabletOrMobile ? "40px" : "0" }}
      >
        <Logo isVisible={!isTabletOrMobile} />
        <Info />
      </div>
    </div>
  );
};

export default Navbar;
