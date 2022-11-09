/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { formatDateToUTC } from "../../utils/format/formatDate";
import Socials from "../Navbar/Info/Socials";
import styles from "./Description.module.css";

type DescriptionDates = {
  start: string;
  tradeDeadline: string;
  end: string;
};

const Description = () => {
  const { data } = useDeployerDuration();
  const [dates, setDates] = useState<DescriptionDates>();

  useEffect(() => {
    if (!data) return;

    setDates({
      start: formatDateToUTC(data.start * 1000),
      tradeDeadline: formatDateToUTC(data.tradeDeadline * 1000),
      end: formatDateToUTC(data.end * 1000),
    });
  }, [data]);

  return (
    <div className={styles.container}>
      <p>
        This page purpose is for the small number of users who minted before the
        bug was caught.
      </p>
      <p>
        You can refund tokens you minted on this page, the new tournament is
        currenty live on{" "}
        <a href="https://www.defifa.net" style={{ color: "var(--gold)" }}>
          defifa.net
        </a>
        .
      </p>
    </div>
  );
};

export default Description;
