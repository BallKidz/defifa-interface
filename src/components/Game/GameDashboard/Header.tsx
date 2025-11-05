import { EthAmount } from "components/UI/EthAmount";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { useGamePotBalance } from "hooks/read/useGamePotBalance";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentPhaseTitle } from "./GameContainer/PlayContent/useCurrentPhaseTitle";
import { PhaseTimer } from "./GameContainer/PlayContent/PhaseTimer";
import { useFarcasterContext } from "hooks/useFarcasterContext";

function GameStats({ compact = false }: { compact?: boolean }) {
  const {
    nfts: { totalSupply },
    currentPhase,
  } = useGameContext();
  const { gameId } = useGameContext();
  const { data: treasuryAmount, isLoading: isTerminalLoading } =
    useGamePotBalance(gameId);

  const mintText = totalSupply && Number(totalSupply) === 1 ? "mint" : "mints";

  if (isTerminalLoading || !totalSupply)
    return <div className="text-center">...</div>;

  if (currentPhase === DefifaGamePhase.COUNTDOWN) return null;

  return (
    <div className={compact ? "flex justify-center" : "flex gap-6 items-center"}>
      <div
        className={`border-4 border-lime-600 border-dotted rounded-2xl px-4 py-3 ${
          compact ? "mx-auto" : ""
        }`}
      >
        <div className="font-medium flex items-baseline gap-3 text-lime-400">
          {treasuryAmount ? (
            <EthAmount
              amountWei={treasuryAmount}
              className={compact ? "text-3xl leading-none" : "text-4xl leading-none"}
              iconClassName={compact ? "h-6 w-6" : "h-7 w-7"}
            />
          ) : null}
          <span className="uppercase text-xs leading-none">in pot</span>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const {
    metadata,
    loading: { metadataLoading },
  } = useGameContext();
  const currentPhaseTitle = useCurrentPhaseTitle();
  const pathname = usePathname();
  const exitPath = pathname?.replace("/play", "") || "";
  const { isInMiniApp } = useFarcasterContext();

  if (metadataLoading) return <div className="text-center">...</div>;

  // Use compact layout for miniapp or mobile, desktop layout for larger screens
  if (isInMiniApp) {
    return (
      <header className="space-y-2">
        <nav className="mt-1 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-neutral-400">
          <Link href={exitPath} className="text-neutral-200">
            ← {metadata?.name}
          </Link>
          /
          <Link href={exitPath} className="font-medium">
            Play
          </Link>
        </nav>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-[8px] w-[8px] bg-lime-400 shadow-glowGreen rounded-full"></span>
            <h1 className="text-2xl font-medium">{currentPhaseTitle}</h1>
          </div>
          <PhaseTimer />
          {metadata?.description && (
            <p className="text-xs text-neutral-400">Rules: {metadata.description}</p>
          )}
          <GameStats compact />
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col md:block">
      <nav className="mt-1 md:mt-6 md:mb-6 flex flex-wrap gap-2 text-xs md:text-sm uppercase md:normal-case tracking-wide text-neutral-400">
        <Link href={exitPath} className="text-neutral-200">
          ← {metadata?.name}
        </Link>
        /
        <Link href={exitPath} className="font-medium">
          Play
        </Link>
      </nav>

      <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
        <div className="md:flex md:flex-col">
          <div className="flex flex-col md:flex-row md:gap-4 md:items-center">
            <div className="flex items-center gap-2">
              <span className="h-[8px] md:h-[10px] w-[8px] md:w-[10px] bg-lime-400 shadow-glowGreen rounded-full"></span>
              <h1 className="text-2xl md:text-3xl font-medium">{currentPhaseTitle}</h1>
            </div>
            <PhaseTimer />
          </div>
          <div className="mt-2 max-w-3xl hidden md:block">
            <span>Rules:</span> {metadata?.description}
          </div>
        </div>
        <div className="md:block">
          <GameStats />
        </div>
      </div>
    </header>
  );
}
