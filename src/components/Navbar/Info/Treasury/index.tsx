import { useNftRewardsTotalSupply } from "../../../../hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "../../../../hooks/read/PaymentTerminalBalance";
import { useProjectCurrentFundingCycle } from "../../../../hooks/read/ProjectCurrentFundingCycle";
import { fromWad } from "../../../../utils/format/formatNumber";
import styles from "./Treasury.module.css";

const Treasury = () => {
  const { data } = useProjectCurrentFundingCycle();

  const { data: treasuryAmount } = usePaymentTerminalBalance();
  const { data: totalSupply } = useNftRewardsTotalSupply(
    data?.metadata.dataSource
  );

  return (
    <div className={styles.container}>
      <h1>
        {fromWad(treasuryAmount)} ETH in pot from 
        <span className={styles.mints}>
          {" "}
          from {totalSupply?.toNumber()} mints
        </span>
      </h1>
    </div>
  );
};

export default Treasury;
