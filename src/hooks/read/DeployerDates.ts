import { useEffect, useState } from "react";
import {
  formatDateToLocal,
  formatDateToUTC,
  formatSecondsToLocal,
  formatSecondsToUTC,
} from "utils/format/formatDate";
import { useGameTimes } from "./useGameTimes";

type DescriptionDates = {
  mintPeriodDuration: {
    date: string;
    phase: number;
  };
  start: {
    date: string;
    phase: number;
  };
  refundPeriodDuration: {
    date: string;
    phase: number;
  };
};

export function useDeployerDates(format: "local" | "utc", gameId: number) {
  const { data: deployerDuration } = useGameTimes(gameId);
  const [dates, setDates] = useState<DescriptionDates>({
    mintPeriodDuration: { date: "", phase: 0 },
    start: { date: "", phase: 0 },
    refundPeriodDuration: { date: "", phase: 0 },
  });

  useEffect(() => {
    if (!deployerDuration) return;

    setDates({
      mintPeriodDuration: {
        date:
          format === "local"
            ? formatSecondsToLocal(
                deployerDuration.mintPeriodDuration +
                  deployerDuration.refundPeriodDuration,
                deployerDuration.start
              )
            : formatSecondsToUTC(
                deployerDuration.mintPeriodDuration +
                  deployerDuration.refundPeriodDuration,
                deployerDuration.start
              ),
        phase: 1,
      },
      refundPeriodDuration: {
        date:
          format === "local"
            ? formatSecondsToLocal(
                deployerDuration.refundPeriodDuration,
                deployerDuration.start
              )
            : formatSecondsToUTC(
                deployerDuration.refundPeriodDuration,
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
