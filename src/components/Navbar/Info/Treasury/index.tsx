import { usePaymentTerminalBalance } from "../../../../hooks/read/PaymentTerminalBalance";
import { fromWad, parseWad } from "../../../../utils/format/formatNumber";
import styles from "./Treasury.module.css";

const Treasury = () => {
  const { data } = usePaymentTerminalBalance();

  return (
    <div className={styles.container}>
      <h1>
        {fromWad(data)} ETH
        <span> from </span>0 players
      </h1>

      <p>current pot</p>
    </div>
  );
};

export default Treasury;
