/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
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

  const checkStampOpacity = useMemo<number>(() => {
    if (selected) {
      return 1;
    }
    return 0;
  }, [selected]);

  return (
    <div className={styles.container}>
      <div
        onClick={() => onTeamClicked(id)}
        className={styles.teamImageWrapper}
      >
        <Image
          src={img}
          style={{ opacity: selected ? 0.8 : 1 }}
          alt={"Team"}
          className={styles.teamImg}
          width="100%"
          height="100%"
          objectFit="contain"
          layout="responsive"
        />

        <Image
          style={{ opacity: checkStampOpacity }}
          className={styles.teamChecked}
          src="/assets/team_selected.png"
          alt="Check"
          layout="fill"
        />
      </div>

      <h3>{name}</h3>
      <p>
        # of mints: {minted} <span>({reaminingSupplyPerc}% of total)</span>
      </p>
    </div>
  );
};

export default Team;
