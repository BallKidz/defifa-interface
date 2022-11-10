import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";
import DefifaDeployer from "@jbx-protocol/juice-defifa/out/DefifaDeployer.sol/DefifaDeployer.json";
import { useState, useEffect } from "react";
import { formatDateToUTC } from "../../utils/format/formatDate";

type DescriptionDates = {
  mint: {
    date: string;
    phase?: number;
  };
  start: {
    date: string;
    phase?: number;
  };
  tradeDeadline: {
    date: string;
    phase?: number;
  };
  end: {
    date: string;
    phase?: number;
  };
};

export function useDeployerDuration() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const defifaDeployer = chainData.defifaDeployer;
  const { data: deployerDates } = useContractRead({
    addressOrName: defifaDeployer,
    contractInterface: DefifaDeployer.abi,
    functionName: "timesFor",
    args: chainData.projectId,
    chainId: chainData.chainId,
  });
  const [dates, setDates] = useState<DescriptionDates>({
    mint: {
      date: "",
      phase: 1,
    },
    start: {
      date: "",
      phase: 2,
    },
    tradeDeadline: {
      date: "",
      phase: 3,
    },
    end: {
      date: "",
      phase: 4,
    },
  });

  useEffect(() => {
    if (!deployerDates) return;

    setDates({
      mint: { date: formatDateToUTC(deployerDates.start * 1000) },
      start: { date: formatDateToUTC(deployerDates.start * 1000) },
      tradeDeadline: {
        date: formatDateToUTC(deployerDates.tradeDeadline * 1000),
      },
      end: { date: formatDateToUTC(deployerDates.end * 1000) },
    });
  }, [deployerDates]);

  return dates;
}
