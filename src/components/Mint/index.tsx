import Link from "next/link";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
import SortSelect from "./SortSelect";
const Mint = () => {
  return (
    <>
      <Content title="MINT">
        <div className={styles.mint}>
          <div className={styles.l1}>
            <h1 className={styles.subtitle}>
              OPEN MINT FOR 0.022 ETH EACH <br /># MINTED: 100
            </h1>
            <Button onClick={() => {}}>MINT 13</Button>
          </div>

          <div className={styles.l2}>
            <SortSelect />
            <button className={styles.selectAll}> SELECT ALL </button>
          </div>
          
        </div>
      </Content>
    </>
  );
};

export default Mint;
