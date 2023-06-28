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
        "relative border-2 group bg-[#181424] border-neutral-800 shadow-lg hover:-translate-y-1 transition-all rounded-xl max-w-[500px] mx-auto overflow-hidden hover:shadow-glowPink hover:border-pink-900",
        isSelected
          ? "border-pink-700 hover:border-pink-800 shadow-glowPink"
          : ""
      )}
    >
      <div className="px-5 pt-5 mb-2">
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

        <div className="mt-4">{extra}</div>
      </div>

      {isSelected ? (
        <div className="flex justify-between">
          <Button
            onClick={onDecrement}
            className="rounded-none flex-1 flex justify-center items-center bg-pink-700 hover:bg-pink-600 transition-colors py-3"
          >
            <MinusIcon className="h-5 w-5" />
          </Button>

          <span className="font-medium px-6 border-x border-pink-800 bg-pink-700 flex justify-center items-center">
            {selectedCount}
          </span>

          <Button
            onClick={onIncrement}
            disabled={
              typeof selectionLimit !== "undefined" &&
              selectedCount >= selectionLimit
            }
            className="flex-1 bg-pink-700 hover:bg-pink-600 transition-colors rounded-none flex justify-center items-center py-3"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={onIncrement}
          disabled={disabled || limitReached}
          className="rounded-none group-hover:opacity-100 opacity-0 w-full py-3"
        >
          Add
        </Button>
      )}
    </div>
  );
}
