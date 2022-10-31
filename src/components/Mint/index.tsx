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
          <div className={styles.mintHeader}>
            <div className={styles.subtitle}>
              PLAY: <b>0.022 ETH / NFT</b>{" "}
            </div>

            <div className={styles.subtitle}>
              # PLAYERS: <b>69 so far</b>{" "}
            </div>

            <div className={styles.sortSelectWrapper}>
              <SortSelect />
            </div>
            
            <div className={styles.buttonWrapper}>
              <Button onClick={() => {}}>MINT 13</Button>
            </div>
          </div>
          <div className={styles.groupsContainer}>
            <Group groupName="A" />
            <Group groupName="B" />
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;
