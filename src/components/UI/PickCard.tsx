import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export interface PickCardProps {
  title: string;
  imageSrc: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  selectedCount: number;
  disabled?: boolean;
  selectionLimit?: number;
  extra: React.ReactNode;
}

export function PickCard({
  title,
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
    <button
      className={twMerge(
        "relative border-2 bg-[#181424] p-5 border-neutral-800 shadow-lg hover:-translate-y-1 transition-all rounded-xl max-w-[500px] mx-auto overflow-hidden hover:shadow-glowPink hover:border-pink-900",
        isSelected
          ? "border-pink-700 hover:border-pink-800 shadow-glowPink"
          : ""
      )}
      role="button"
      onClick={onIncrement}
      disabled={disabled || limitReached}
    >
      <div className="text-lg text-left">{title}</div>

      <div className="rounded-md overflow-hidden border-black p-2 shadow-inner border-2">
        <Image
          src={imageSrc}
          crossOrigin="anonymous"
          alt="Team"
          width={500}
          height={500}
        />
      </div>

      <div className="p-3 bottom-14 right-0 absolute z-10">
        {isSelected ? (
          <div className="flex gap-2 items-center">
            <p>{selectedCount}</p>
            <button
              className="rounded-full disabled:cursor-not-allowed font-medium px-2 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 bg-pink-600 hover:bg-pink-500 text-neutral-50"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                onIncrement?.();
              }}
              disabled={
                typeof selectionLimit !== "undefined" &&
                selectedCount >= selectionLimit
              }
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded-full font-medium px-2 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 bg-pink-600 hover:bg-pink-500 text-neutral-50"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                onDecrement?.();
              }}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">{extra}</div>
    </button>
  );
}
