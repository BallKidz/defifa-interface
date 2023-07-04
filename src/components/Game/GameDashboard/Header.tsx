import Button from "components/UI/Button";
import { EthAmount } from "components/UI/EthAmount";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { usePaymentTerminalBalance } from "hooks/read/usePaymentTerminalBalance";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCurrentPhaseTitle } from "./GameContainer/PlayContent/useCurrentPhaseTitle";

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
    <div className="flex gap-6 items-center">
      <div className="border-4 border-lime-600 border-dotted rounded-2xl px-4 py-3">
        <div className="font-medium flex items-baseline gap-3 text-lime-400">
          {treasuryAmount ? (
            <EthAmount
              amountWei={treasuryAmount}
              className="text-4xl leading-none"
              iconClassName="h-7 w-7"
            />
          ) : null}
          <span className="uppercase text-xs leading-none">in pot</span>
        </div>
      </div>
      {/* <div className="flex gap-1 flex-col items-end">
        <span className="uppercase text-sm">Mints</span>
        <span className="font-medium flex items-center gap-1 text-2xl">
          {totalSupply?.toNumber()}
        </span>
      </div> */}
      {/* <div>
        <span className="font-bold">6</span> players
      </div> */}
    </div>
  );
}

export function Header() {
  const {
    metadata,
    loading: { metadataLoading },
  } = useGameContext();
  const currentPhaseTitle = useCurrentPhaseTitle();

  const router = useRouter();
  const exitPath = router.asPath.replace("/play", "");

  if (metadataLoading) return <div className="text-center">...</div>;

  return (
    <header>
      <div className="mt-3 mb-8">
        <Link href={exitPath}>
          <a>
            <Button
              size="sm"
              category="tertiary"
              variant="default"
              className="mb-1"
            >
              ← Exit
            </Button>
          </a>
        </Link>

        <div className="text-sm text-neutral-300 font-light">
          Playing {metadata?.name}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <div>
            <h1 className="text-3xl font-medium">{currentPhaseTitle}</h1>
            <div className="mt-2 max-w-3xl hidden md:block">
              <span>Rules:</span> {metadata?.description}
            </div>
          </div>
        </div>
        <GameStats />
      </div>
    </header>
  );
}
