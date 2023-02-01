import FileUpload from "../../FileUpload";
import Button from "../../UI/Button";
import styles from "./BracketCreate.module.css";

const BracketCreate = () => {
  const onCreate = () => {
  };
  return (
    <form onSubmit={onCreate} className={styles.container}>
      <h1 className={styles.contentTitle}>METADATA</h1>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          MINTING ENDS:
          <input type="date" className={styles.input} />
        </label>
        <label className={styles.label}>
          TRADE DEADLINE:
          <input type="date" className={styles.input} />
        </label>
        <label className={styles.label}>
          GAME ENDS:
          <input type="date" className={styles.input} />
        </label>
      </div>
      <div className={styles.tierContainer}>
        <div className={styles.tierCreate}>
          <h1 className={styles.contentTitle}>TIERS</h1>
          <label className={styles.label}>
            TIER NAME:
            <input
              type="text"
              className={styles.input}
              placeholder="ARGENTINA"
            />
          </label>
          <FileUpload />
          <Button>ADD TIER</Button>
        </div>
        <div>
          <h1 className={styles.contentTitle}>TIERS PREVIEW</h1>
          <div className={styles.tierPreview}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>
      </div>
      <h1 className={styles.contentTitle}>COMPLETE</h1>
      <Button type="submit" size="big">
        CREATE YOUR OWN TOURNAMENT
      </Button>
    </form>
  );
};

export default BracketCreate;
