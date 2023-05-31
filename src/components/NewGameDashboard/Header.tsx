import { useGameContext } from "contexts/GameContext";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { usePaymentTerminalBalance } from "hooks/read/PaymentTerminalBalance";
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
  const { currentFundingCycle } = useGameContext();
  const { data: treasuryAmount } = usePaymentTerminalBalance();
  const { data: totalSupply } = useNftRewardsTotalSupply(
    currentFundingCycle?.metadata.dataSource
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
  const {
    metadata,
    loading: { metadataLoading },
  } = useGameContext();

  if (metadataLoading) return <div className="text-center">...</div>;

  return (
    <header>
      <h1 className="text-4xl text-center mb-4">{metadata?.name ?? 'Unknown game'}</h1>
      <GameStats />
    </header>
  );
}
