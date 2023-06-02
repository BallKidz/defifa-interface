import { useEffect, useState } from "react";
import {
  formatDateToLocal,
  formatDateToUTC,
  formatSecondsToLocal,
  formatSecondsToUTC,
} from "utils/format/formatDate";
import { useGameTimes } from "./GameTimes";

type DescriptionDates = {
  mintDuration: {
    date: string;
    phase: number;
  };
  start: {
    date: string;
    phase: number;
  };
  refundDuration: {
    date: string;
    phase: number;
  };
};

export function useDeployerDates(format: "local" | "utc") {
  const { data: deployerDuration } = useGameTimes();
  const [dates, setDates] = useState<DescriptionDates>({
    mintDuration: { date: "", phase: 0 },
    start: { date: "", phase: 0 },
    refundDuration: { date: "", phase: 0 },
  });

  useEffect(() => {
    if (!deployerDuration) return;

    setDates({
      mintDuration: {
        date:
          format === "local"
            ? formatSecondsToLocal(
                deployerDuration.mintDuration + deployerDuration.refundDuration,
                deployerDuration.start
              )
            : formatSecondsToUTC(
                deployerDuration.mintDuration + deployerDuration.refundDuration,
                deployerDuration.start
              ),
        phase: 1,
      },
      refundDuration: {
        date:
          format === "local"
            ? formatSecondsToLocal(
                deployerDuration.refundDuration,
                deployerDuration.start
              )
            : formatSecondsToUTC(
                deployerDuration.refundDuration,
                deployerDuration.start
              ),
        phase: 2,
      },
      start: {
        date:
          format === "local"
            ? formatDateToLocal(deployerDuration.start * 1000)
            : formatDateToUTC(deployerDuration.start * 1000),
        phase: 3,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployerDuration]);

  return dates;
}
