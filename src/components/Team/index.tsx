/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useMemo, useState } from "react";
import Button from "../UI/Button";
import styles from "./Team.module.css";

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

  const calculateSeed = (threshold: number, id: number) => {
    return id - threshold + 1;
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
    <div className={styles.parent}>
      <div className={styles.container}>
        <div
          className={styles.imageContainer}
          onClick={() => onTeamClicked(id)}
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

        <div
          className={styles.dataContainer}
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            height: "35px",
          }}
        >
          <h3>{name}</h3>
          {selected ? (
            <div className={styles.quantityContainer}>
              <p>{tierIds.length}</p>
              <Button size="extraSmall" onClick={onAddTierIds}>
                +
              </Button>
              <Button onClick={onRemoveTierIds} size="extraSmall">
                -
              </Button>
            </div>
          ) : null}
        </div>

        <p>
          Mints: {minted} <span>({reaminingSupplyPerc}% of total)</span>
        </p>
        <p>Seed: #{id < 8 ? id : calculateSeed(8, id)}</p>
      </div>

      <div className={styles.vsContainer}>
        <p style={{ visibility: isVersus ? "visible" : "hidden" }}>VS</p>
      </div>
    </div>
  );
};

export default Team;
