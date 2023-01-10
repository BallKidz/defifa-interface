import { useEffect, useState } from "react";
import {
  formatDateToLocal,
  formatDateToUTC,
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

  console.log({ deployerDuration });

  useEffect(() => {
    if (!deployerDuration) return;

    setDates({
      mintDuration: {
        date:
          format === "local"
            ? formatDateToLocal(deployerDuration.start * 1000)
            : formatDateToUTC(deployerDuration.start * 1000),
        phase: 1,
      },
      start: {
        date:
          format === "local"
            ? formatDateToLocal(deployerDuration.start * 1000)
            : formatDateToUTC(deployerDuration.start * 1000),
        phase: 2,
      },
      refundPeriodDuration: {
        date:
          format === "local"
            ? formatDateToLocal(deployerDuration.tradeDeadline * 1000)
            : formatDateToUTC(deployerDuration.tradeDeadline * 1000),
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
