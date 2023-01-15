import { useEffect, useState } from "react";
import {
  formatDateToLocal,
  formatDateToUTC,
  formatSecondsToLocal,
  formatSecondsToUTC,
} from "../../utils/format/formatDate";
import { useDeployerDuration } from "./DeployerDuration";

type DescriptionDates = {
  mintDuration: {
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
  end: {
    date: string;
    phase: number;
  };
};

export function useDeployerDates(format: "local" | "utc") {
  const deployerDuration = useDeployerDuration();
  const [dates, setDates] = useState<DescriptionDates>({
    mintDuration: { date: "", phase: 0 },
    start: { date: "", phase: 0 },
    refundPeriodDuration: { date: "", phase: 0 },
    end: { date: "", phase: 0 },
  });

  useEffect(() => {
    if (!deployerDuration) return;

    setDates({
      mintDuration: {
        date:
          format === "local"
            ? formatSecondsToLocal(
                deployerDuration.mintDuration +
                  deployerDuration.refundPeriodDuration,
                deployerDuration.start
              )
            : formatSecondsToUTC(
                deployerDuration.mintDuration +
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
      end: {
        date:
          format === "local"
            ? formatDateToLocal(deployerDuration.end * 1000)
            : formatDateToUTC(deployerDuration.end * 1000),
        phase: 4,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployerDuration]);

  return dates;
}
