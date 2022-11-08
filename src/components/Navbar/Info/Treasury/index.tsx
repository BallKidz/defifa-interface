import { useNftRewardsTotalSupply } from "../../../../hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "../../../../hooks/read/PaymentTerminalBalance";
import { fromWad, parseWad } from "../../../../utils/format/formatNumber";
import styles from "./Treasury.module.css";

const Treasury = () => {
  const { data } = usePaymentTerminalBalance();
  const { data: totalSupply } = useNftRewardsTotalSupply();

  return (
    <div className={styles.container}>
      <h1>
        {fromWad(data)} ETH
        <span className={styles.mints}>
          {" "}
          from {totalSupply?.toNumber()} mints
        </span>
      </h1>

      <p>Current pot</p>
    </div>
  );
};

export default Treasury;
