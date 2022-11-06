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
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const onTeamClicked = (id: number) => {
    setSelected(!selected);
    onClick?.(id);
  };

  useEffect(() => {
    if (txState) {
      setSelected(false);
    }
  }, [txState]);

  useEffect(() => {
    setSelected(selectAll);
  }, [selectAll]);

  const reaminingSupplyPerc =
    minted > 0 ? ((minted / supply) * 100).toFixed(0) : 0;

  const opacity = useMemo<number>(() => {
    if (selected) {
      return 1;
    }
    return 0.5;
  }, [selected]);

  return (
    <div className={styles.container} style={{ opacity }}>
      <img
        src={img}
        crossOrigin="anonymous"
        alt="Team"
        className={styles.teamImg}
        onClick={() => onTeamClicked(id)}
      />
      <h3>{name}</h3>
      <p>
        # of mints: {minted} <span>({reaminingSupplyPerc}% of total)</span>
      </p>
    </div>
  );
};

export default Team;
