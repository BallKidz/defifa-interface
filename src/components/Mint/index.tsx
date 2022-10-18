import Group from "../Group";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
import SortSelect from "./SortSelect/SortSelect";
const Mint = () => {
  return (
    <>
      <Content title="MINT [WORK IN PROGRESS]">
        <div className={styles.mint}>
          <div className={styles.l1}>
            <h1 className={styles.subtitle}>
              OPEN MINT FOR 0.022 ETH EACH <br /># MINTED: 100
            </h1>

            <div className={styles.buttonFloater}>
              <div className={styles.buttonWrapper}>
                <Button onClick={() => {}}>MINT 13</Button>
              </div>
            </div>
          </div>

          <div className={styles.l2}>
            <div className={styles.sortSelectWrapper}>
              <SortSelect />
            </div>
            <div>
              <button className={styles.selectAll}> SELECT ALL </button>
            </div>
          </div>
          <div className={styles.groupsContainer}>
            <Group />
            <Group />
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;
