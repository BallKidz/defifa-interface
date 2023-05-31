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
  selectAll?: boolean;
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
    setSelected(selectAll ?? false);
  }, [selectAll]);

  const supplyPortion = minted > 0 ? ((minted / supply) * 100).toFixed(0) : 0;

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
        "relative border border-gray-800 rounded-md max-w-[500px] mx-auto",
        selected ? "border-violet-800 shadow-glow" : ""
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

      <div className="p-3 bottom-14 right-0 absolute">
        {selected ? (
          <div className="flex gap-2 items-center">
            <p>{tierIds.length}</p>
            <Button onClick={onAddTierIds}>+</Button>
            <Button onClick={onRemoveTierIds}>-</Button>
          </div>
        ) : null}
      </div>

      <div className="p-3">
        {minted} minted <span>({supplyPortion}% of total)</span>
      </div>
    </div>
  );
};

export default Team;
