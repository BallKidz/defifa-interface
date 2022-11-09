/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useMemo, useState } from "react";
import styles from "./Team.module.css";

interface TeamProps {
  id: number;
  img: string;
  name: string;
  minted: number;
  supply: number;
  selectAll: boolean;
  txState?: boolean;
  onClick?: (id: number) => void;
  onClickMultiple?: (id: number[]) => void;
}

const Team: FC<TeamProps> = ({
  id,
  img,
  name,
  minted,
  supply,
  txState,
  selectAll,
  onClick,
  onClickMultiple,
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

  const checkStampOpacity = useMemo<number>(() => {
    if (selected) {
      return 1;
    }
    return 0;
  }, [selected]);

  const onAddTierIds = () => {
    setTierIds([...tierIds, id]);
    onClickMultiple?.(tierIds);
  };

  const onRemoveTierIds = () => {
    if (tierIds.length > 1) {
      setTierIds([...tierIds.slice(-1)]);
      onClickMultiple?.(tierIds);
    } else {
      setTierIds([]);
      onClickMultiple?.([]);
      setSelected(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        onClick={() => onTeamClicked(id)}
        style={{ position: "relative", cursor: "pointer" }}
      >
        <img
          src={img}
          style={{ opacity: selected ? 0.8 : 1 }}
          crossOrigin="anonymous"
          alt="Team"
          className={styles.teamImg}
        />
        <img
          style={{ opacity: checkStampOpacity }}
          className={styles.teamChecked}
          src="/assets/team_selected.png"
          alt="Check"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{name}</h3>
        {selected ? (
          <div style={{ display: "flex", gap: "15px" }}>
            <p>{tierIds.length}</p>
            <button onClick={onAddTierIds}>+</button>
            <button onClick={onRemoveTierIds}>-</button>
          </div>
        ) : null}
      </div>

      <p>
        # of mints: {minted} <span>({reaminingSupplyPerc}% of total)</span>
      </p>
    </div>
  );
};

export default Team;
