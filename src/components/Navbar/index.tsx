import { PropsWithChildren, useEffect, useState } from "react";
import useWindowDimensions from "hooks/useWindowDimensions";
import styles from "./Navbar.module.css";

const Navbar = (props: PropsWithChildren) => {
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
      {props.children}
    </div>
  );
};

export default Navbar;
