import { Pill } from "components/UI/Pill";
import Wallet from "components/layout/Navbar/Wallet";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { usePaymentTerminalBalance } from "hooks/read/usePaymentTerminalBalance";
import { fromWad } from "utils/format/formatNumber";

function GameStats() {
  const {
    nfts: { totalSupply },
    currentPhase,
  } = useGameContext();
  const { gameId } = useGameContext();
  const { data: treasuryAmount, isLoading: isTerminalLoading } =
    usePaymentTerminalBalance(gameId);

  const mintText = totalSupply?.toNumber() === 1 ? "mint" : "mints";

  if (isTerminalLoading || !totalSupply)
    return <div className="text-center">...</div>;

  if (currentPhase === DefifaGamePhase.COUNTDOWN) return null;

  return (
    <div className="flex gap-4 text-sm">
      <div>
        <span className="font-bold">{fromWad(treasuryAmount)} ETH</span> in pot
      </div>
      |
      {/* <div>
        <span className="font-bold">6</span> players
      </div> */}
      <div>
        <span className="font-bold">{totalSupply?.toNumber()}</span> {mintText}
      </div>
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
    <header className="flex justify-between">
      <div>
        <h1 className="text-3xl font-medium mb-2 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)] max-w-prose">
          {metadata?.name}
        </h1>
        <GameStats />
      </div>
      <div>
        <Wallet />
      </div>
    </header>
  );
}
