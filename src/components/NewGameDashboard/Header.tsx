import { useGameContext } from "contexts/GameContext";
import { usePaymentTerminalBalance } from "hooks/read/PaymentTerminalBalance";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { fromWad } from "utils/format/formatNumber";

const SUCCESS_STYLE = "border-lime-900 text-lime-400 shadow-glowGreen";
const NEUTRAL_STYLE = "border-neutral-500";

function Pill({
  children,
  variant = "default",
}: PropsWithChildren<{ variant?: "success" | "default" }>) {
  return (
    <span
      className={twMerge(
        "px-3 py-1 rounded-full text-sm font-medium border",
        variant === "success" ? SUCCESS_STYLE : NEUTRAL_STYLE
      )}
    >
      {children}
    </span>
  );
}

function GameStats() {
  const {
    nfts: { totalSupply },
  } = useGameContext();
  const { gameId } = useGameContext();
  const { data: treasuryAmount, isLoading: isTerminalLoading } =
    usePaymentTerminalBalance(gameId);

  const mintText = totalSupply?.toNumber() === 1 ? "mint" : "mints";

  if (isTerminalLoading || !totalSupply)
    return <div className="text-center">...</div>;

  return (
    <div className="flex justify-center gap-4">
      <Pill variant="success">
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
      <h1 className="text-5xl text-center mb-5 [text-shadow:_0_5px_30px_rgb(250_250_250_/_20%)]">{metadata?.name}</h1>
      <GameStats />
    </header>
  );
}
