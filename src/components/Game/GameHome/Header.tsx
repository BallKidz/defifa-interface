import Button from "components/UI/Button";
import { EthAmount } from "components/UI/EthAmount";
import { EthLogo } from "components/UI/EthLogo";
import Wallet from "components/layout/Navbar/Wallet";
import { useGameContext } from "contexts/GameContext";
import { formatEther } from "ethers/lib/utils";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { usePaymentTerminalBalance } from "hooks/read/usePaymentTerminalBalance";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card } from "./Card";
import { useCurrentPhaseTitle } from "../GameDashboard/GameContainer/PlayContent/useCurrentPhaseTitle";
import FourItemsDisplay from "./FourItemsDisplay";
import { CountdownPhaseContent } from "../GameDashboard/GameContainer/PlayContent/CountdownPhaseContent";

function GameStats() {
  const {
    nfts: { totalSupply },
    currentPhase,
  } = useGameContext();
  const { gameId } = useGameContext();
  const { data: treasuryAmount, isLoading: isTerminalLoading } =
    usePaymentTerminalBalance(gameId);

  const mintText = totalSupply?.toNumber() === 1 ? "mint" : "mints";
  if (currentPhase === DefifaGamePhase.COUNTDOWN) return <CountdownPhaseContent />;
  if (isTerminalLoading || !totalSupply)
    return <div className="text-center">...</div>;

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
    </div>
  );
}

export function Header() {
  const {
    metadata,
    nfts: { tiers },
    loading: { metadataLoading },
  } = useGameContext();

  const router = useRouter();
  const playPath = router.asPath + "/play";
  const phaseTitle = useCurrentPhaseTitle();

  if (metadataLoading) return <div className="text-center">...</div>;

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h1 className="text-3xl mb-5 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)] max-w-prose">
          {metadata?.name}
        </h1>
        <div className="flex gap-4">
          <FourItemsDisplay />
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center items-center">
        {phaseTitle}
        <GameStats />

        <Link href={playPath}>
          <a className="w-full">
            <Button className="w-full" size="lg">
              Play now →
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
