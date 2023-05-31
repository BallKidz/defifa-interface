import { useGameContext } from "contexts/GameContext";
import { useGameMetadata } from "hooks/read/GameMetadata";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "hooks/read/PaymentTerminalBalance";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { PropsWithChildren } from "react";
import { fromWad } from "utils/format/formatNumber";

function Pill({ children }: PropsWithChildren<{}>) {
  return (
    <span className="px-3 py-1 rounded-full text-sm font-medium border border-neutral-700">
      {children}
    </span>
  );
}

function GameStats() {
  const { data } = useProjectCurrentFundingCycle();
  const { data: treasuryAmount } = usePaymentTerminalBalance();
  const { data: totalSupply } = useNftRewardsTotalSupply(
    data?.metadata.dataSource
  );

  return (
    <div className="flex justify-center gap-4">
      <Pill>
        <span className="font-bold">{fromWad(treasuryAmount)} ETH</span> in pot
      </Pill>

      {/* <Pill>
        <span className="font-bold">6</span> players
      </Pill> */}

      <Pill>
        <span className="font-bold">{totalSupply?.toNumber()}</span> mints
      </Pill>
    </div>
  );
}

export function Header() {
  const { gameId } = useGameContext();
  const { data: gameMetadata, isLoading } = useGameMetadata(gameId);

  if (isLoading) return <div className="text-center">...</div>;

  return (
    <header>
      <h1 className="text-4xl text-center mb-6">{gameMetadata?.name}</h1>
      <GameStats />
    </header>
  );
}
