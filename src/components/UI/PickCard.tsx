import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export interface PickCardProps {
  imageSrc: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  selectedCount: number;
  disabled?: boolean;
  selectionLimit?: number;
  extra: React.ReactNode;
}

export function PickCard({
  imageSrc,
  onIncrement,
  onDecrement,
  selectedCount,
  selectionLimit,
  disabled,
  extra,
}: PickCardProps) {
  const isSelected = selectedCount > 0;

  const limitReached =
    typeof selectionLimit !== "undefined" && selectedCount >= selectionLimit;

  return (
    <div
      className={twMerge(
        "relative border border-neutral-800 rounded-md max-w-[500px] mx-auto",
        isSelected ? "border-pink-800 shadow-glowPink" : ""
      )}
    >
      <button
        className="rounded-md overflow-hidden shadow-md"
        role="button"
        onClick={onIncrement}
        disabled={disabled || limitReached}
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
              className="rounded-full disabled:cursor-not-allowed font-medium px-2 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 bg-pink-600 hover:bg-pink-500 text-neutral-50"
              onClick={onIncrement}
              disabled={
                typeof selectionLimit !== "undefined" &&
                selectedCount >= selectionLimit
              }
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded-full font-medium px-2 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 bg-pink-600 hover:bg-pink-500 text-neutral-50"
              onClick={onDecrement}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="p-3">{extra}</div>
    </div>
  );
}
