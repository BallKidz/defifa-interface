import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

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
    <div
      className={twMerge(
        "relative border-2 group bg-[#181424] border-neutral-800 shadow-lg hover:-translate-y-1 transition-all rounded-xl overflow-hidden hover:shadow-glowPink hover:border-pink-900",
        isSelected
          ? "border-pink-700 hover:border-pink-800 shadow-glowPink"
          : ""
      )}
    >
      <div className="px-4 pt-4 mb-2">
        <div className="text-base text-left font-medium mb-2 truncate" title={title}>{title}</div>

        <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              crossOrigin="anonymous"
              alt={title}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-[#fea282] text-3xl font-bold mb-1">
                {title.substring(0, 9).toUpperCase()}
              </div>
              <div className="text-[#c0b3f1] text-xs">Outcome</div>
            </div>
          )}
        </div>

        <div className="mt-3">{extra}</div>
      </div>

      {isSelected ? (
        <div className="flex justify-between">
          <Button
            onClick={onDecrement}
            className="rounded-none flex-1 flex justify-center items-center bg-pink-700 hover:bg-pink-600 transition-colors py-3 px-2 min-w-0"
          >
            <MinusIcon className="h-4 w-4 flex-shrink-0" />
          </Button>

          <span className="font-medium px-3 border-x border-pink-800 bg-pink-700 flex justify-center items-center text-sm">
            {selectedCount}
          </span>

          <Button
            onClick={onIncrement}
            disabled={
              typeof selectionLimit !== "undefined" &&
              selectedCount >= selectionLimit
            }
            className="flex-1 bg-pink-700 hover:bg-pink-600 transition-colors rounded-none flex justify-center items-center py-3 px-2 min-w-0"
          >
            <PlusIcon className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={onIncrement}
          disabled={disabled || limitReached}
          className="rounded-none group-hover:opacity-100 opacity-0 w-full py-3 text-sm"
        >
          Add
        </Button>
      )}
    </div>
  );
}
