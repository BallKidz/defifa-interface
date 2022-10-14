import Link from "next/link";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
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
            <div>
              <label htmlFor="sort">SORT BY:</label>

              <select name="sort" id="sort">
                <option value="group">GROUP</option>
                <option value="minted">MOST MINTED</option>
              </select>
            </div>

            <button className={styles.selectAll}> SELECT ALL </button>
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;
