import { useGameContext } from "contexts/GameContext";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "hooks/read/PaymentTerminalBalance";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { fromWad } from "utils/format/formatNumber";

const Treasury = () => {
  const { gameId } = useGameContext();
  const { data } = useProjectCurrentFundingCycle(gameId);
  const { data: treasuryAmount } = usePaymentTerminalBalance(gameId);
  const { data: totalSupply } = useNftRewardsTotalSupply(
    data?.metadata.dataSource
  );

  return (
    <div className="flex gap-x-10 rounded-lg">
      <div className="flex flex-col">
        <span className="text-sm">Pot size</span>
        <span className="text-xl">{fromWad(treasuryAmount)} ETH</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm">Mints</span>
        <span className="text-xl">{totalSupply?.toNumber()} NFTs</span>
      </div>
    </div>
  );
};

export default Treasury;
