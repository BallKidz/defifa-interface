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
    nfts: { tiers },
    loading: { metadataLoading },
  } = useGameContext();

  const router = useRouter();
  const playPath = router.asPath + "/play";

  if (metadataLoading) return <div className="text-center">...</div>;

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h1 className="text-3xl mb-5 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)] max-w-prose">
          {metadata?.name}
        </h1>
        <div className="flex gap-4">
          {tiers?.map((tier) => (
            <Card
              key={tier.id}
              title={tier.teamName}
              imageSrc={tier.teamImage}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center items-center">
        <GameStats />

        <Link href={playPath}>
          <a>
            <Button className="w-full" size="lg">
              Explore and mint →
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
