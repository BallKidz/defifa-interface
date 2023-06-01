/* eslint-disable @next/next/no-img-element */
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useGameContext } from "contexts/GameContext";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function MintCard({
  imageSrc,
  onIncrement,
  onDecrement,
  selectedCount,
  mintedCount,
  disabled,
}: {
  imageSrc: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  selectedCount: number;
  mintedCount: number;
  disabled?: boolean;
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
      <button
        className="rounded-md overflow-hidden shadow-md"
        role="button"
        onClick={onIncrement}
        disabled={disabled}
      >
        <Image
          src={imageSrc}
          crossOrigin="anonymous"
          alt="Team"
          width={500}
          height={500}
        />
      </button>

      <div className="p-3 bottom-14 right-0 absolute">
        {isSelected ? (
          <div className="flex gap-2 items-center">
            <p>{selectedCount}</p>
            <button
              className="rounded-full font-medium px-2 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 bg-violet-600 hover:bg-violet-500 text-gray-50"
              onClick={onIncrement}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded-full font-medium px-2 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 bg-violet-600 hover:bg-violet-500 text-gray-50"
              onClick={onDecrement}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="p-3">
        {mintedCount} minted <span>({supplyPortion}% of total)</span>
      </div>
    </div>
  );
}
