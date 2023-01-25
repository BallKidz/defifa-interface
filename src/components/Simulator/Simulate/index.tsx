import styles from "./SimulatorCreate.module.css";
import DataTable, { createTheme } from 'react-data-table-component';
import { useNftRewardsTotalSupply } from "../../../hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "../../../hooks/read/PaymentTerminalBalance";
import { fromWad } from "../../../utils/format/formatNumber";
import { liveScores } from "../../../constants/liveScores";

const SimulatorCreate = () => {
  const { data: totalSupply } = useNftRewardsTotalSupply();
  const { data: treasuryAmount } = usePaymentTerminalBalance();
  
  const columns = [
    {
      name: 'Team',
      selector: (row: { team: any; }) => row.team,
    },
    {
      name: 'Mints',
      selector: (row: { mints: any; }) => row.mints,
    },
    {
      name: 'Expected Burn Value',
      selector: (row: { ev: any; }) => row.ev,
    },
    {
      name: 'WCW',
      selector: (row: { wcw: any; }) => row.wcw,
    },
    {
      name: 'Divisional',
      selector: (row: { divisional: any; }) => row.divisional,
    },
    {
      name: 'Conference',
      selector: (row: { conference: any; }) => row.conference,
    },
    {
      name: 'Finals',
      selector: (row: { finals: any; }) => row.finals,
    },

  ];
  
  const data1 = liveScores?.map((tier) => {
    return {
      team: tier.team,
      mints: tier.mints,
      ev: tier.ev,
      wcw: tier.wcw,
      divisional: tier.divisional,
      conference: tier.conference,
      finals: tier.finals,
      };
  });
  // Sort for readability. Not needed if liveScores is already sorted.
  const data = data1?.slice()
    .sort(
      (a: { mints: number }, b: { mints: number }) => {
        return b.mints - a.mints;
      }
    );

  // createTheme creates a new theme with the given name and overrides
  createTheme('default', {
    background: {
      default: 'transparent',
    },
    text: {
      primary: '#c0b3f0',
      secondary: '#FFFFFF',
      size: '18px', // TODO: This is not working. Want to change the font size.
    },   
  });

  const onCreate = () => {
  };
  // TODO: Mobile view is not working. Need to fix. Scoring rubric is cut off.
  // Consider moving data to json file and importing it. Create tourny flow for updating json file.
  return (
    <form onSubmit={onCreate} className={styles.container}>
      <h1 className={styles.contentTitle}>SCORING RUBRIC</h1>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          MINTS: <span>{totalSupply?.toNumber()}</span>
        </label>
        <label className={styles.label}>
          THE POT: {fromWad(treasuryAmount)} ETH
        </label>
        <label className={styles.label}>
          WCW=3669
        </label>
        <label className={styles.label}>
          DIVISIONAL=4000
        </label>
        <label className={styles.label}>
          CONFERENCE=10000
        </label>
        <label className={styles.label}>
          FINALS=26000
        </label>
      </div>
      <h1 className={styles.contentTitle}>LIVE SCORECARD</h1>
      <DataTable
        title="Expected score"
        columns={columns}
        data={data}
        dense
        // See https://react-data-table-component.netlify.app/?path=/docs/api-custom-styles--page
      />
    </form>
  );
};

export default SimulatorCreate;
