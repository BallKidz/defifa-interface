/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import styles from "./Team.module.css";

interface TeamProps {
  id: number;
  img: string;
  name: string;
  minted: number;
  supply: number;
  onClick?: (id: number) => void;
}

const Team: FC<TeamProps> = ({ id, img, name, minted, supply, onClick }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const onTeamClicked = (id: number) => {
    setSelected(!selected);
    onClick?.(id);
  };

  return (
    <div className={styles.container} style={{ opacity: selected ? 0.5 : 1 }}>
      <img
        src={img}
        alt="Team"
        className={styles.teamImg}
        onClick={() => onTeamClicked(id)}
      />
      <h3>{name}</h3>
      <p>
        # of mints: {minted} <span>(2% of total)</span>
      </p>
    </div>
  );
};

export default Team;
