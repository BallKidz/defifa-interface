import { useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Info from "./Info";
import styles from "./Navbar.module.css";

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
    <div
      className={styles.container}
      style={{ marginTop: isTabletOrMobile ? "40px" : "0" }}
    >
      <Info />
    </div>
  );
};

export default Navbar;
