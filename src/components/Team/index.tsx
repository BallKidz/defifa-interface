/* eslint-disable @next/next/no-img-element */
import Button from "components/UI/Button";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TeamProps {
  id: number;
  img: string;
  name: string;
  minted: number;
  supply: number;
  isVersus?: boolean;
  selectAll: boolean;
  txState?: boolean;
  onClick?: (id: number) => void;
  onAddMultiple?: (id: number) => void;
  onRemoveMultiple?: (id: number) => void;
}

const Team: FC<TeamProps> = ({
  id,
  img,
  name,
  minted,
  supply,
  isVersus,
  txState,
  selectAll,
  onClick,
  onAddMultiple,
  onRemoveMultiple,
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [tierIds, setTierIds] = useState<number[]>([id]);
  const onTeamClicked = (id: number) => {
    setSelected(!selected);
    setTierIds([id]);
    onClick?.(id);
  };

  useEffect(() => {
    if (txState) {
      setSelected(false);
      setTierIds([id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txState]);

  useEffect(() => {
    setSelected(selectAll);
  }, [selectAll]);

  const reaminingSupplyPerc =
    minted > 0 ? ((minted / supply) * 100).toFixed(0) : 0;

  const onAddTierIds = () => {
    setTierIds([...tierIds, id]);
    onAddMultiple?.(id);
  };

  const onRemoveTierIds = () => {
    if (tierIds.length > 1) {
      const copy = [...tierIds];
      copy.pop();
      setTierIds(copy);
      onRemoveMultiple?.(id);
    } else {
      onRemoveMultiple?.(id);
      setTierIds([]);
      setSelected(false);
    }
  };

  return (
    <div
      className={twMerge(
        "flex flex-col gap-1 border border-gray-800 rounded-md hover:-translate-y-0.5 transition-transform duration-200 max-w-[500px] mx-auto",
        selected ? "border-violet-500" : ""
      )}
    >
      <div
        className="cursor-pointer rounded-md overflow-hidden shadow-md"
        role="button"
        onClick={() => onTeamClicked(id)}
      >
        <Image
          src={img}
          crossOrigin="anonymous"
          alt="Team"
          width={500}
          height={500}
        />
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center">
          <span className="w-full">{name}</span>
          {selected ? (
            <div className="flex gap-2 items-center">
              <p>{tierIds.length}</p>
              <Button onClick={onAddTierIds}>+</Button>
              <Button onClick={onRemoveTierIds}>-</Button>
            </div>
          ) : null}
        </div>

        <p>
          Mints: {minted} <span>({reaminingSupplyPerc}% of total)</span>
        </p>
      </div>
    </div>
  );
};

export default Team;
