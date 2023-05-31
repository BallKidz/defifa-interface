/* eslint-disable @next/next/no-img-element */
import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function MintCard({
  imageSrc,
  onIncrement,
  onDecrement,
  selectedCount,
  mintedCount,
}: {
  imageSrc: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  selectedCount: number;
  mintedCount: number;
}) {
  const {
    nfts: { totalSupply },
  } = useGameContext();

  const isSelected = selectedCount > 0;
  const supplyPortion =
    mintedCount > 0 && totalSupply
      ? ((mintedCount / totalSupply?.toNumber()) * 100).toFixed(0)
      : 0;

  return (
    <div
      className={twMerge(
        "relative border border-gray-800 rounded-md max-w-[500px] mx-auto",
        isSelected ? "border-violet-800 shadow-glow" : ""
      )}
    >
      <div
        className="cursor-pointer rounded-md overflow-hidden shadow-md"
        role="button"
        onClick={onIncrement}
      >
        <Image
          src={imageSrc}
          crossOrigin="anonymous"
          alt="Team"
          width={500}
          height={500}
        />
      </div>

      <div className="p-3 bottom-14 right-0 absolute">
        {isSelected ? (
          <div className="flex gap-2 items-center">
            <p>{selectedCount}</p>
            <Button onClick={onIncrement}>+</Button>
            <Button onClick={onDecrement}>-</Button>
          </div>
        ) : null}
      </div>

      <div className="p-3">
        {mintedCount} minted <span>({supplyPortion}% of total)</span>
      </div>
    </div>
  );
}
