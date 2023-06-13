import { Pill } from "components/UI/Pill";
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
    <div className="flex justify-center gap-4">
      <Pill category={treasuryAmount.eq(0) ? "default" : "success"}>
        <span className="font-bold">{fromWad(treasuryAmount)} ETH</span> in pot
      </Pill>

      {/* <Pill>
        <span className="font-bold">6</span> players
      </Pill> */}

      <Pill>
        <span className="font-bold">{totalSupply?.toNumber()}</span> {mintText}
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
      <h1 className="text-5xl text-center mb-5 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)] max-w-3xl mx-auto">
        {metadata?.name}
      </h1>
      <GameStats />
    </header>
  );
}
