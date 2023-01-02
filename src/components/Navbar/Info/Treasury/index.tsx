import { useNftRewardsTotalSupply } from "../../../../hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "../../../../hooks/read/PaymentTerminalBalance";
import { fromWad, parseWad } from "../../../../utils/format/formatNumber";
import styles from "./Treasury.module.css";

const Treasury = () => {
  const { data: treasuryAmount } = usePaymentTerminalBalance();
  const { data: totalSupply } = useNftRewardsTotalSupply();
  const treasuryFormatted = fromWad(treasuryAmount);

  return (
    <div className={styles.container}>
      <h1>
        {parseFloat(treasuryFormatted).toFixed(0)} ETH
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
