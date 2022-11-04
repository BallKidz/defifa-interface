/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import styles from "./Team.module.css";

interface TeamProps {
  id: number;
  img: string;
  name: string;
  supply: any;
  onClick?: (id: number) => void;
}

const Team: FC<TeamProps> = ({ id, img, name, supply, onClick }) => {
  const [selected, setSelected] = useState<boolean>(false);

  const onTeamClicked = (id: number) => {
    onClick?.(id);
    setSelected(!selected);
  };

  return (
    <div
      id={id.toString()}
      className={styles.container}
      onClick={() => onTeamClicked(id)}
    >
      <img src={img} alt="Team" className={styles.teamImg} />
      <h3>{name}</h3>
      <p>
        # of mints: {supply} <span>(2% of total)</span>
      </p>
    </div>
  );
};

export default Team;
